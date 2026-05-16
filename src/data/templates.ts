import type { ChecklistTemplate } from './schema';
import { modelYLTemplate } from './model-y-l';

export const templates: Record<string, ChecklistTemplate> = {
  [modelYLTemplate.modelId]: modelYLTemplate,
};

export const defaultModelId = modelYLTemplate.modelId;

export function getTemplate(modelId: string): ChecklistTemplate {
  return templates[modelId] ?? modelYLTemplate;
}

export function listTemplates(): ChecklistTemplate[] {
  return Object.values(templates);
}
