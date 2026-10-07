import { API_ENDPOINTS, API_UJJAIN_URL, DEFAULT_HEADERS } from "@/constants/api";
import {
  FormApiResponse,
  FormDefinition,
  FormSubmitErrorResponse,
  FormSubmitPayload,
  FormSubmitSuccessResponse,
} from "@/types/form";

export class FormSubmissionError extends Error {
  code: string;
  field?: string;
  status?: number;

  constructor(message: string, code: string = "error", field?: string, status?: number) {
    super(message);
    this.name = "FormSubmissionError";
    this.code = code;
    this.field = field;
    this.status = status;
  }
}

/**
 * Fetch dynamic form schema from Ujjain Custom REST API
 */
export const fetchPackageFormSchema = async (): Promise<FormDefinition> => {
  const url = `${API_UJJAIN_URL}${API_ENDPOINTS.FORMS_PACKAGE}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load form schema (Status: ${response.status})`);
    }

    const json: FormApiResponse = await response.json();
    if (!json.success || !json.data) {
      throw new Error("Invalid form schema response received");
    }

    return json.data;
  } catch (error) {
    console.error("API ERROR (fetchPackageFormSchema):", error);
    throw error;
  }
};

/**
 * Submit dynamic package enquiry form to Ujjain Custom REST API
 */
export const submitPackageForm = async (
  formData: Record<string, any>
): Promise<FormSubmitSuccessResponse> => {
  const url = `${API_UJJAIN_URL}${API_ENDPOINTS.FORMS_PACKAGE_SUBMIT}`;

  const payload: FormSubmitPayload = {
    ...formData,
    "enquiry-source": "mobile_app",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.code && !data.success)) {
      const errData = data as FormSubmitErrorResponse | null;
      const message = errData?.message || "Failed to submit enquiry. Please try again.";
      const code = errData?.code || "submission_error";
      const field = errData?.data?.field;
      const status = response.status || errData?.data?.status;

      throw new FormSubmissionError(message, code, field, status);
    }

    return data as FormSubmitSuccessResponse;
  } catch (error) {
    if (error instanceof FormSubmissionError) {
      throw error;
    }
    console.error("API ERROR (submitPackageForm):", error);
    throw new FormSubmissionError(
      error instanceof Error ? error.message : "Network error. Please check your connection.",
      "network_error"
    );
  }
};
