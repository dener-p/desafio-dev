"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSettled: () => {
      queryClient.invalidateQueries();
    },
    onError: (error: Error | AxiosError) => {
      if (error instanceof AxiosError) {
        const data = error.response?.data as { message?: string };
        const message = data?.message ?? "Erro interno";
        toast.error(message);
        return;
      }
      toast.error("Erro interno");
    },
    onSuccess: (data) => {
      const response = data as { msg?: string };
      if (response?.msg) {
        toast.success(response.msg);
      }
    },
  }),
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
