import { api } from "@/lib/api";
import { categoriesSchemas } from "@desafio-dev/shared/categories-schemas";
import z from "zod";

export type Category = z.infer<typeof categoriesSchemas.categoryResponse>;

const getCategories = {
  queryKey: ["categories"],
  queryFn: async () => {
    const res = await api.get("/categories");
    return res.data as Category[];
  },
};

const newCategory = {
  mutationKey: ["create", "category"],
  mutationFn: async (
    data: z.infer<typeof categoriesSchemas.createCategory>,
  ) => {
    const res = await api.post("/categories", data);
    return res.data as Category[];
  },
};

const deleteCategory = {
  mutationKey: ["delete", "category"],
  mutationFn: async (id: number) => {
    const res = await api.delete("/categories/" + id);
    return res.data;
  },
};

export const categories = {
  getCategories,
  newCategory,
  deleteCategory,
};
