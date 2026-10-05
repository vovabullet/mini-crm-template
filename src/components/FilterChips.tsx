import type { OrderFilter } from '../types';
import { FILTER_LABELS } from '../utils/labels';

const FILTERS: OrderFilter[] = ['all', 'new', 'in-progress', 'completed'];

interface FilterChipsProps {
  active: OrderFilter;
  onChange: (filter: OrderFilter) => void;
}

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="filter-chips">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`filter-chip${filter === active ? ' active' : ''}`}
          onClick={() => onChange(filter)}
        >
          {FILTER_LABELS[filter]}
        </button>
      ))}
    </div>
  );
}
