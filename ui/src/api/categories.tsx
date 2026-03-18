import { api } from "@/lib/api";
import { categoriesSchemas } from "@desafio-dev/shared/categories-schemas";
import { useMutation, useQuery } from "@tanstack/react-query";
import z from "zod";

const getCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      const json = res.data;
      if (res.status >= 400) {
        throw new Error({
          cause: json.cause,
          message: json.message,
        });
      }
      return json;
    },
  });

const newCategory = () =>
  useMutation({
    mutationKey: ["create", "category"],
    mutationFn: async (
      data: z.infer<typeof categoriesSchemas.createCategory>,
    ) => {
      const res = await api.post("/categories", data);
      const json = res.data;
      if (res.status >= 400) {
        throw new Error({
          cause: json.cause,
          message: json.message,
        });
      }
      return json;
    },
  });

export const categories = {
  getCategories,
  newCategory,
};
