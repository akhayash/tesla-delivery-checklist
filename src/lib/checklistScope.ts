import type {
  ChecklistCategory,
  ChecklistSnapshot,
  ChecklistTemplate,
  ItemStatus,
  Severity,
  SeverityFilter,
} from '@/data/schema';

export const severityFilterMeta: Record<
  SeverityFilter,
  { label: string; description: string }
> = {
  critical: {
    label: '最低限',
    description: '重大のみ',
  },
  standard: {
    label: '標準',
    description: '重大＋要対応',
  },
  all: {
    label: '全項目',
    description: '軽微を含むすべて',
  },
};

export function includesSeverity(
  filter: SeverityFilter,
  severity: Severity = 'minor'
) {
  if (filter === 'all') return true;
  if (filter === 'standard') return severity !== 'minor';
  return severity === 'critical';
}

export function getScopedCategories(
  template: ChecklistTemplate,
  filter: SeverityFilter
): ChecklistCategory[] {
  return template.categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        includesSeverity(filter, item.severity ?? 'minor')
      ),
    }))
    .filter((category) => category.items.length > 0);
}

export function getScopedItemIds(
  template: ChecklistTemplate,
  filter: SeverityFilter
) {
  return getScopedCategories(template, filter).flatMap((category) =>
    category.items.map((item) => item.id)
  );
}

export function getScopedStats(
  template: ChecklistTemplate,
  snapshot: ChecklistSnapshot,
  filter: SeverityFilter
) {
  const totals: Record<ItemStatus, number> & { total: number; checked: number; issues: number } = {
    unchecked: 0,
    ok: 0,
    issue: 0,
    na: 0,
    total: 0,
    checked: 0,
    issues: 0,
  };

  for (const category of getScopedCategories(template, filter)) {
    for (const item of category.items) {
      const status = snapshot.states[item.id]?.status ?? 'unchecked';
      totals[status]++;
      totals.total++;
      if (status !== 'unchecked') totals.checked++;
      if (status === 'issue') totals.issues++;
    }
  }

  return totals;
}
