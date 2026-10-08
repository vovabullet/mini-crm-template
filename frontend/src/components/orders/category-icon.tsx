import {
  BriefcaseIcon,
  CakeSliceIcon,
  CarIcon,
  ScissorsIcon,
  SmartphoneIcon,
  SofaIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// Иконка подбирается по ключевым словам категории — легко расширять под новые профессии.
const RULES: Array<[RegExp, LucideIcon]> = [
  [/кондит|торт|пекар|выпеч/i, CakeSliceIcon],
  [/авто|механ|шиномонт/i, CarIcon],
  [/сантех|электр|ремонт квартир/i, WrenchIcon],
  [/мебел|сборк/i, SofaIcon],
  [/техник|телефон|компьют/i, SmartphoneIcon],
  [/барбер|парикмах|маникюр|стриж/i, ScissorsIcon],
]

export function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = RULES.find(([re]) => re.test(category))?.[1] ?? BriefcaseIcon
  return <Icon className={cn("size-6", className)} aria-hidden />
}
