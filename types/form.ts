/**
 * Dynamic CF7 Form Types
 * Matches the schema returned by GET /wp-json/ujjain/v1/forms/:id
 */

export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "number";

export interface FormFieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType | string;
  required: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
}

export interface FormDefinition {
  id: string;
  cf7_id: number;
  title: string;
  fields: FormField[];
}

export interface FormApiResponse {
  success: boolean;
  data: FormDefinition;
}

export interface FormSubmitPayload {
  [fieldName: string]: any;
  "enquiry-source"?: string;
}

export interface FormSubmitSuccessResponse {
  success: true;
  message: string;
  form?: {
    key: string;
    cf7Id: number;
  };
  data?: Record<string, any>;
}

export interface FormSubmitErrorResponse {
  code: string;
  message: string;
  data?: {
    status: number;
    field?: string;
    [key: string]: any;
  };
}
