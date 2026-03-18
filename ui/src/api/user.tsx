import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const me = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      const json = res.data;
      if (res.status >= 400) {
        throw new Error({
          cause: json.cause,
          message: json.message,
        });
      }
      return json;
    },
    retry: 0,
  });

export const user = {
  me,
};
