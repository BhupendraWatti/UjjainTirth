import {
  FormDefinition,
  FormSubmitSuccessResponse,
} from "@/types/form";
import {
  FormSubmissionError,
  fetchPackageFormSchema,
  submitPackageForm,
} from "@/services/formService";
import { useMutation, useQuery } from "@tanstack/react-query";

/**
 * Hook to fetch the dynamic package form schema definition
 */
export const usePackageFormSchema = () => {
  const query = useQuery<FormDefinition, Error>({
    queryKey: ["forms", "package"],
    queryFn: fetchPackageFormSchema,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
    gcTime: 1000 * 60 * 60, // 60 minutes retention
    retry: 2,
  });

  return {
    schema: query.data || null,
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
    reload: query.refetch,
  };
};

/**
 * Hook to submit dynamic package form enquiry
 */
export const usePackageFormSubmit = () => {
  const mutation = useMutation<
    FormSubmitSuccessResponse,
    FormSubmissionError,
    Record<string, any>
  >({
    mutationFn: submitPackageForm,
  });

  return {
    submit: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    result: mutation.data,
    reset: mutation.reset,
  };
};
