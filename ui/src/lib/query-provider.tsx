"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSettled: () => {
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      const response = data as { msg?: string };
      console.log({ response });
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
