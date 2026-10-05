// Кроссплатформенный запуск Django из npm-скриптов (Windows / macOS / Linux).
import { spawn, spawnSync } from "node:child_process"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const backend = path.join(root, "backend")
const isWin = process.platform === "win32"
const venvPython = path.join(backend, ".venv", isWin ? "Scripts" : "bin", isWin ? "python.exe" : "python")
const port = process.env.API_PORT || "8000"

const log = (msg) => console.log(`\x1b[36m[backend]\x1b[0m ${msg}`)
const fail = (msg) => {
  console.error(`\x1b[31m[backend] ${msg}\x1b[0m`)
  process.exit(1)
}

function runSync(cmd, args, label) {
  log(`${label}…`)
  const result = spawnSync(cmd, args, { cwd: backend, stdio: "inherit" })
  if (result.error) fail(`${label}: не удалось запустить ${cmd} (${result.error.message})`)
  if (result.status !== 0) fail(`${label}: команда завершилась с кодом ${result.status}`)
}

/** Ищем настоящий Python 3.10+. На Windows "python" часто оказывается заглушкой Microsoft Store. */
function findPython() {
  const candidates = []
  if (process.env.PYTHON) candidates.push([process.env.PYTHON, []])
  if (isWin) candidates.push(["py", ["-3"]], ["python", []], ["python3", []])
  else candidates.push(["python3", []], ["python", []])

  for (const [cmd, pre] of candidates) {
    const r = spawnSync(cmd, [...pre, "-c", "import sys; print(sys.version_info[:2] >= (3, 10), sys.executable)"], {
      encoding: "utf8",
    })
    const out = (r.stdout || "").trim()
    if (r.status === 0 && out.startsWith("True")) {
      log(`Python: ${out.slice(5)}`)
      return [cmd, pre]
    }
    if (r.status === 0 && out.startsWith("False")) log(`${cmd}: версия Python ниже 3.10, пропускаю`)
  }
  fail(
    "Python 3.10+ не найден.\n" +
      (isWin
        ? "  Установите Python с https://www.python.org/downloads/ (галочка «Add python.exe to PATH»)\n" +
          "  и отключите заглушки: Параметры → Приложения → Псевдонимы выполнения приложений → python.exe / python3.exe.\n" +
          '  Либо укажите путь явно (PowerShell): $env:PYTHON="C:\\path\\to\\python.exe"; npm run setup'
        : "  Установите python3 и python3-venv.\n  Либо укажите путь явно: PYTHON=/path/to/python3 npm run setup")
  )
}

function requireVenv() {
  if (!existsSync(venvPython)) fail(`Python-окружение не найдено (${venvPython}). Сначала выполните: npm run setup:api`)
}

const [task, ...rest] = process.argv.slice(2)

switch (task) {
  case "setup": {
    if (!existsSync(venvPython)) {
      const [py, pre] = findPython()
      runSync(py, [...pre, "-m", "venv", ".venv"], "Создаю виртуальное окружение backend/.venv")
      if (!existsSync(venvPython)) fail(`venv создан, но ${venvPython} не найден`)
    } else {
      log("Окружение backend/.venv уже есть")
    }
    runSync(venvPython, ["-m", "pip", "install", "--upgrade", "pip", "-q"], "Обновляю pip")
    runSync(venvPython, ["-m", "pip", "install", "-r", "requirements.txt"], "Ставлю зависимости Python")
    runSync(venvPython, ["manage.py", "migrate"], "Применяю миграции")
    runSync(venvPython, ["manage.py", "seed_demo"], "Создаю демо-заказы")
    log("\x1b[32m✓ Бэкенд готов. Запуск: npm run dev\x1b[0m")
    break
  }
  case "run": {
    requireVenv()
    const child = spawn(venvPython, ["manage.py", "runserver", `0.0.0.0:${port}`], { cwd: backend, stdio: "inherit" })
    child.on("error", (e) => fail(`Не удалось запустить Django: ${e.message}`))
    const stop = () => child.kill("SIGTERM")
    process.on("SIGINT", stop)
    process.on("SIGTERM", stop)
    child.on("exit", (code) => process.exit(code ?? 0))
    break
  }
  case "manage":
    requireVenv()
    runSync(venvPython, ["manage.py", ...rest], `manage.py ${rest.join(" ")}`)
    break
  default:
    fail("Использование: node scripts/backend.mjs <setup|run|manage> [...]")
}
