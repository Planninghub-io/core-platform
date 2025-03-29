
export interface FormFieldProps {
  id: string;
  label: string;
  value: string | number | null;
  placeholder?: string;
  isEditing: boolean;
  onChange: (value: string | number) => void;
  type?: "text" | "number" | "textarea" | "select";
  options?: Array<{value: string, label: string}>;
  prefix?: string;
  showEditButton?: boolean;
  onEditClick?: () => void;
}

export interface ReadOnlyFieldProps {
  value: string | number | null;
  placeholder: string;
  prefix?: string;
  handleFieldClick: () => void;
}

export interface EditableFieldProps {
  id: string;
  value: string | number | null;
  onChange: (value: string | number) => void;
  onSave: () => void;
  onCancel: () => void;
  isFieldEditing: boolean;
}

export interface InputFieldProps extends EditableFieldProps {
  type: string;
  required?: boolean;
}

export interface SelectFieldProps extends EditableFieldProps {
  options: Array<{value: string, label: string}>;
  placeholder: string;
}
