import { API_CF7_URL, API_ENDPOINTS, API_UJJAIN_URL } from "@/constants/api";
import {
  FormApiResponse,
  FormDefinition,
  FormSubmitSuccessResponse,
} from "@/types/form";
import { getBookingToken } from "@/services/booking-session";

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
 * Submit dynamic package enquiry through Contact Form 7 so its mail workflow runs.
 */
export const submitPackageForm = async (
  { formId, formData }: { formId: number; formData: Record<string, any> }
): Promise<FormSubmitSuccessResponse> => {
  const url = `${API_CF7_URL}/contact-forms/${formId}/feedback`;
  const payload = new FormData();
  const bookingToken = await getBookingToken();

  Object.entries({ ...formData, "enquiry-source": "mobile_app" }).forEach(
    ([field, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => payload.append(`${field}[]`, String(item)));
      } else if (value !== undefined && value !== null) {
        payload.append(field, String(value));
      }
    }
  );
  payload.append("_wpcf7_unit_tag", `wpcf7-f${formId}-o1`);
  if (bookingToken) payload.append("utbm-booking-token", bookingToken);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(bookingToken ? { "X-UTBM-Booking-Token": bookingToken } : {}),
      },
      body: payload,
    });

    const data = await response.json().catch(() => null) as {
      status?: string;
      message?: string;
      invalid_fields?: { field?: string; message?: string }[];
    } | null;

    if (!response.ok || data?.status !== "mail_sent") {
      const invalidField = data?.invalid_fields?.[0];
      throw new FormSubmissionError(
        invalidField?.message || data?.message || "Failed to submit enquiry. Please try again.",
        data?.status || "submission_error",
        invalidField?.field,
        response.status
      );
    }

    return {
      success: true,
      message: data.message || "Thank you for your enquiry. It has been sent.",
      form: { key: "package", cf7Id: formId },
      data: formData,
    };
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
