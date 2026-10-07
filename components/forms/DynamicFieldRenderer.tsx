import { FormField } from "@/types/form";
import React from "react";
import { CheckboxField } from "./fields/CheckboxField";
import { DateField } from "./fields/DateField";
import { RadioField } from "./fields/RadioField";
import { SelectField } from "./fields/SelectField";
import { TextInputField } from "./fields/TextInputField";
import { TextareaField } from "./fields/TextareaField";

interface DynamicFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const normalizedType = (field.type || "text").toLowerCase().trim();

  switch (normalizedType) {
    case "email":
    case "tel":
    case "number":
    case "text":
      return (
        <TextInputField
          field={field}
          value={value ?? ""}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );

    case "textarea":
      return (
        <TextareaField
          field={field}
          value={value ?? ""}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );

    case "date":
      return (
        <DateField
          field={field}
          value={value ?? ""}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );

    case "select":
      return (
        <SelectField
          field={field}
          value={value ?? ""}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );

    case "radio":
      return (
        <RadioField
          field={field}
          value={value ?? ""}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );

    case "checkbox":
      return (
        <CheckboxField
          field={field}
          value={value ?? []}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );

    default:
      // Fallback for any unexpected custom field type
      return (
        <TextInputField
          field={field}
          value={value ?? ""}
          onChange={onChange}
          error={error}
          disabled={disabled}
        />
      );
  }
};
