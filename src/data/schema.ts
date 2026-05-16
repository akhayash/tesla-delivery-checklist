export type ItemStatus = 'unchecked' | 'ok' | 'issue' | 'na';

export type Severity = 'critical' | 'major' | 'minor';

export type SeverityFilter = 'critical' | 'standard' | 'all';

export interface ChecklistItem {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  /** Plain-language definition of jargon used in the title (Tesla-specific or automotive terms). Shown via an (i) button. */
  glossary?: string;
  severity?: Severity;
  /** Estimated minutes to perform the check on-site. Falls back to a severity-based default if omitted. */
  estimatedMinutes?: number;
  applicableTo?: string[];
  references?: string[];
}

export interface ChecklistCategory {
  id: string;
  title: string;
  icon?: string;
  locationHint?: string;
  items: ChecklistItem[];
}

export interface ModelSpec {
  wheelbaseMm?: number;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  curbWeightKg?: number;
  seats?: number;
  drivetrain?: string;
  notes?: string[];
}

export interface ChecklistTemplate {
  modelId: string;
  modelName: string;
  modelNameJa: string;
  version: string;
  releasedAt: string;
  market?: string;
  specs?: ModelSpec;
  categories: ChecklistCategory[];
}

export interface UserItemState {
  itemId: string;
  status: ItemStatus;
  note?: string;
  mediaIds: string[];
  updatedAt: string;
}

export interface DeliveryMeta {
  modelId: string;
  vin?: string;
  ownerName?: string;
  advisorName?: string;
  deliveryLocation?: string;
  deliveryDate?: string;
  softwareVersion?: string;
}

export interface ChecklistSnapshot {
  meta: DeliveryMeta;
  states: Record<string, UserItemState>;
  startedAt: string;
  updatedAt: string;
  templateVersion: string;
}
