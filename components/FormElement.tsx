export type FormElementType = 'text' | 'dropdown' | 'checkbox' | 'radio';

export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  options?: string[];
}

export const formElementPalette: FormElement[] = [
  { id: 'text', type: 'text', label: 'Text Input' },
  { id: 'dropdown', type: 'dropdown', label: 'Dropdown', options: ['Option 1'] },
  { id: 'checkbox', type: 'checkbox', label: 'Checkbox' },
  { id: 'radio', type: 'radio', label: 'Radio Button' },
];