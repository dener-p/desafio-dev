import { api } from "@/lib/api";
import { DefaultErrorType } from "@/types/default-error-type";
import { userSchemas } from "@desafio-dev/shared/user-schemas";
import z from "zod";

const me = {
  queryKey: ["user", "me"],
  queryFn: async () => {
    const res = await api.get("/auth/me");
    if (res.status >= 400) {
      const json = res.data as DefaultErrorType;
      throw new Error(json?.message ?? "Erro interno", { cause: json?.cause });
    }
    return res.data as z.infer<typeof userSchemas.me>;
  },
  retry: 0,
};

const login = {
  mutationKey: ["user", "login"],
  mutationFn: async (data: z.infer<typeof userSchemas.login>) => {
    const res = await api.post("/auth/login", data);
    const json = res.data as DefaultErrorType;
    if (res.status >= 400) {
      throw new Error(json?.message ?? "Erro interno", { cause: json?.cause });
    }
  },
};

const signup = {
  mutationKey: ["user", "signup"],
  mutationFn: async (data: z.infer<typeof userSchemas.createUser>) => {
    const res = await api.post("/auth/singup", data);
    if (res.status >= 400) {
      const json = res.data as DefaultErrorType;
      throw new Error(json?.message ?? "Erro interno", { cause: json?.cause });
    }
  },
};

const logout = {
  mutationKey: ["user", "logout"],
  mutationFn: async () => {
    const res = await api.post("/auth/logout");
    if (res.status >= 400) {
      const json = res.data as DefaultErrorType;
      throw new Error(json?.message ?? "Erro interno", { cause: json?.cause });
    }
    return;
  },
};

export const auth = {
  me,
  signup,
  login,
  logout,
};
