"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";
import { Trash2, Tags, Plus } from "lucide-react";
import { categoriesSchemas } from "@desafio-dev/shared/categories-schemas";
import { categories } from "@/api/categories";

type CategoryFormData = z.infer<typeof categoriesSchemas.createCategory>;

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const createCategory = categories.newCategory();
  const { data } = categories.getCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoriesSchemas.createCategory),
  });

  const onSubmit = async (data: CategoryFormData) => {
    createCategory.mutate(data);
  };

  const handleDelete = async (id: number) => {};

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Tags className="text-blue-400" size={28} />
        <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">
              Add Category
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  placeholder="e.g. Salary, Groceries"
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-transform transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
                {isSubmitting ? "Saving..." : "Add"}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white">
                Your Categories
              </h2>
            </div>

            <ul className="divide-y divide-slate-800">
              {data?.map((cat) => (
                <li
                  key={cat.id}
                  className="p-4 px-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-slate-200 font-medium">{cat.name}</span>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
