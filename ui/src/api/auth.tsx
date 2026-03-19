import { api } from "@/lib/api";
import { userSchemas } from "@desafio-dev/shared/user-schemas";
import z from "zod";

const me = {
  queryKey: ["user", "me"],
  queryFn: async () => {
    const res = await api.get("/auth/me");
    return res.data as z.infer<typeof userSchemas.me>;
  },
  retry: 0,
};

const login = {
  mutationKey: ["user", "login"],
  mutationFn: async (data: z.infer<typeof userSchemas.login>) => {
    const res = await api.post("/auth/login", data);
    const { token } = res.data as z.infer<typeof userSchemas.loginResponse>;

    localStorage.setItem("auth_token", token);
    return res.data;
  },
};

const signup = {
  mutationKey: ["user", "signup"],
  mutationFn: async (data: z.infer<typeof userSchemas.createUser>) => {
    const res = await api.post("/auth/singup", data);
    return res.data;
  },
};

const logout = {
  mutationKey: ["user", "logout"],
  mutationFn: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },
};

export const auth = {
  me,
  signup,
  login,
  logout,
};
