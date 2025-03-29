
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { ReadOnlyField } from './ReadOnlyField';
import { TextAreaField } from './TextAreaField';
import { SelectField } from './SelectField';
import { PrefixedInputField } from './PrefixedInputField';
import { StandardInputField } from './StandardInputField';
import { FormFieldProps } from './types';

export const FormField = ({
  id,
  label,
  value,
  placeholder = "",
  isEditing,
  onChange,
  type = "text",
  options = [],
  prefix,
  showEditButton = false,
  onEditClick
}: FormFieldProps) => {
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const [tempValue, setTempValue] = useState<string | number | null>(value);
  
  const handleFieldClick = () => {
    if (!isEditing && onEditClick) {
      onEditClick();
      setIsFieldEditing(true);
      setTempValue(value);
    }
  };
  
  const handleSaveField = () => {
    if (tempValue !== null) {
      onChange(tempValue);
    }
    setIsFieldEditing(false);
  };

  const handleCancelField = () => {
    setTempValue(value);
    setIsFieldEditing(false);
  };
  
  const handleChange = (newValue: string | number) => {
    if (isFieldEditing) {
      setTempValue(newValue);
    } else {
      onChange(newValue);
    }
  };

  const renderEditableField = () => {
    if (type === "textarea") {
      return (
        <TextAreaField
          id={id}
          value={isFieldEditing ? tempValue : value}
          onChange={handleChange}
          onSave={handleSaveField}
          onCancel={handleCancelField}
          isFieldEditing={isFieldEditing}
        />
      );
    }

    if (type === "select" && options.length > 0) {
      return (
        <SelectField
          id={id}
          value={isFieldEditing ? tempValue : value}
          options={options}
          onChange={handleChange}
          onSave={handleSaveField}
          onCancel={handleCancelField}
          isFieldEditing={isFieldEditing}
          placeholder={placeholder}
        />
      );
    }

    if (prefix) {
      return (
        <PrefixedInputField
          id={id}
          type={type}
          value={isFieldEditing ? tempValue : value}
          onChange={handleChange}
          onSave={handleSaveField}
          onCancel={handleCancelField}
          isFieldEditing={isFieldEditing}
          required={id === "title"}
        />
      );
    }

    return (
      <StandardInputField
        id={id}
        type={type}
        value={isFieldEditing ? tempValue : value}
        onChange={handleChange}
        onSave={handleSaveField}
        onCancel={handleCancelField}
        isFieldEditing={isFieldEditing}
        required={id === "title"}
      />
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={id}>{label}</Label>
      </div>
      {isEditing || isFieldEditing ? renderEditableField() : (
        <ReadOnlyField 
          value={value} 
          placeholder={placeholder} 
          prefix={prefix} 
          handleFieldClick={handleFieldClick} 
        />
      )}
    </div>
  );
};
