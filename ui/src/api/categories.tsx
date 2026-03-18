import { api } from "@/lib/api";
import { DefaultErrorType } from "@/types/default-error-type";
import { categoriesSchemas } from "@desafio-dev/shared/categories-schemas";
import z from "zod";

export type Category = z.infer<typeof categoriesSchemas.categoryResponse>;

const getCategories = {
  queryKey: ["categories"],
  queryFn: async () => {
    const res = await api.get("/categories");
    if (res.status >= 400) {
      const json = res.data as DefaultErrorType;
      throw new Error(json?.message ?? "Erro interno", { cause: json?.cause });
    }
    return res.data as Category[];
  },
};

const newCategory = {
  mutationKey: ["create", "category"],
  mutationFn: async (
    data: z.infer<typeof categoriesSchemas.createCategory>,
  ) => {
    const res = await api.post("/categories", data);
    if (res.status >= 400) {
      const json = res.data as DefaultErrorType;
      throw new Error(json?.message ?? "Erro interno", { cause: json?.cause });
    }
    return res.data as Category[];
  },
};

const deleteCategory = {
  mutationKey: ["delete", "category"],
  mutationFn: async (id: number) => {
    const res = await api.delete("/categories/" + id);
    if (res.status >= 400) {
      const json = res.data as DefaultErrorType;
      throw new Error(json?.message ?? "Erro interno", { cause: json?.cause });
    }
  },
};

export const categories = {
  getCategories,
  newCategory,
  deleteCategory,
};
