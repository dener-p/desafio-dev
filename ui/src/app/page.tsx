"use client";

import { Plus, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/utils/format-date";
import { transactions } from "@/api/transactions";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  const { data } = useQuery(transactions.getTransactions);
  if (!data) return;

  const totalIncome = data
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = data
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link
          href="/transactions/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus size={20} />
          Nova transação
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <ArrowUpCircle size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Ganhos</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </div>

        <div className="bg-card border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-xl">
            <ArrowDownCircle size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Despesas</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalExpense)}
            </p>
          </div>
        </div>

        <div className="bg-card border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div
            className={`p-4 rounded-xl ${balance >= 0 ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"}`}
          >
            <Wallet size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Saldo Atual</p>
            <p
              className={`text-2xl font-bold ${balance >= 0 ? "text-white" : "text-red-400"}`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-slate-800 rounded-2xl overflow-hidden ">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">
            Transações Recentes
          </h2>
        </div>

        {data.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {data.map((t) => (
              <div
                key={t.id}
                className="p-6 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-200">
                    {t.description}
                  </span>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">
                      {t.categoryName || "Geral"}
                    </span>
                    <span>{formatDate(t.date)}</span>
                  </div>
                </div>
                <div
                  className={`font-semibold ${t.type === "income" ? "text-emerald-400" : "text-red-400"}`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
