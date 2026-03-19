"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { transactionsSchemas } from "@desafio-dev/shared/transactions-schemas";
import { transactions, Transactions } from "@/api/transactions";
import { categories } from "@/api/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type TransactionFormData = z.infer<
  typeof transactionsSchemas.createTransaction
>;
type UpdateTransactionFormData = z.infer<
  typeof transactionsSchemas.updateTransactoin
>;

export const CreateTransaction = () => {
  const [open, setOpen] = useState(false);
  const createTransaction = useMutation({
    ...transactions.newTransactions,
    onSuccess: () => setOpen(false),
  });
  const { data } = useQuery(categories.getCategories);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionsSchemas.createTransaction),
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    createTransaction.mutate(data);
    reset();
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
            size="lg"
          >
            <Plus /> Nova transação
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova transação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tipo
              </label>
              <select
                {...register("type")}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
              >
                <option value="expense">Despesa</option>
                <option value="income">Ganho</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Data
              </label>
              <input
                {...register("date")}
                type="date"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow [color-scheme:dark]"
              />
              {errors.date && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Descrição
            </label>
            <input
              {...register("description")}
              type="text"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Valor (R$)
              </label>
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0.01"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-xl font-medium"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 flex justify-between">
                Categoria
                <Link
                  href="/categories"
                  className="text-blue-400 text-xs hover:underline"
                >
                  Gerenciar
                </Link>
              </label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
              >
                <option value="">Selecione uma categoria.</option>
                {data?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button
              type="submit"
              size="lg"
              loading={createTransaction.isPending}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-transform transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              <Plus size={20} />
              Salvar transação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const UpdateTransaction = ({
  transaction,
}: {
  transaction: UpdateTransactionFormData;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const updateTransactoin = useMutation({
    ...transactions.updateTransaction,
    onSuccess: () => setOpen(false),
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: transactions.getTransactions.queryKey,
      });
      const previousCategories = queryClient.getQueryData<Transactions[]>(
        transactions.getTransactions.queryKey,
      );
      if (previousCategories) {
        queryClient.setQueryData<Transactions[]>(
          transactions.getTransactions.queryKey,
          previousCategories.map((t) => {
            if (t.id === data.id) {
              return {
                ...data,
                categoryName: t.categoryName,
              };
            }
            return t;
          }),
        );
      }

      return { previousCategories };
    },
  });
  const { data } = useQuery(categories.getCategories);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateTransactionFormData>({
    resolver: zodResolver(transactionsSchemas.updateTransactoin),
    values: transaction,
  });

  const onSubmit = async (data: UpdateTransactionFormData) => {
    updateTransactoin.mutate(data);
    reset();
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button size="icon-xs" title="Editar transação">
            <Edit />
          </Button>
        }
      ></DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar transação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Tipo
              </label>
              <select
                {...register("type")}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
              >
                <option value="expense">Despesa</option>
                <option value="income">Ganho</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Data
              </label>
              <input
                {...register("date")}
                type="date"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow [color-scheme:dark]"
              />
              {errors.date && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Descrição
            </label>
            <input
              {...register("description")}
              type="text"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            {errors.description && (
              <p className="text-red-400 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Valor (R$)
              </label>
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0.01"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-xl font-medium"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 flex justify-between">
                Categoria
                <Link
                  href="/categories"
                  className="text-blue-400 text-xs hover:underline"
                >
                  Gerenciar
                </Link>
              </label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
              >
                <option value="">Selecione uma categoria.</option>
                {data?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button
              type="submit"
              size="lg"
              loading={updateTransactoin.isPending}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-transform transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              <Plus size={20} />
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteTransaction = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  const deleteTransaction = useMutation({
    ...transactions.deleteTransaction,
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: transactions.getTransactions.queryKey,
      });
      const previousCategories = queryClient.getQueryData<
        UpdateTransactionFormData[]
      >(transactions.getTransactions.queryKey);
      // Optimistically update the cache
      if (previousCategories) {
        queryClient.setQueryData<UpdateTransactionFormData[]>(
          transactions.getTransactions.queryKey,
          previousCategories.filter((t) => t.id !== id),
        );
      }

      return { previousCategories };
    },
  });

  return (
    <Button
      disabled={deleteTransaction.isPending}
      variant="destructive"
      size="icon-xs"
      title="delete"
      onClick={() => deleteTransaction.mutate(id)}
    >
      <Trash2 />
    </Button>
  );
};
