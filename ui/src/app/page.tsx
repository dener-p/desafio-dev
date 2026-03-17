"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Plus, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { formatDate } from "@/utils/format-date";

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  categoryName: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    try {
      const { data } = await api.get("/transactions");
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading)
    return <div className="p-8 text-slate-400">Loading...</div>;
  if (!user) return null;

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value / 100);
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link
          href="/transactions/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus size={20} />
          New Transaction
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <ArrowUpCircle size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Income</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalIncome)}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-xl">
            <ArrowDownCircle size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Expense</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalExpense)}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
          <div
            className={`p-4 rounded-xl ${balance >= 0 ? "bg-blue-500/10 text-blue-500" : "bg-red-500/10 text-red-500"}`}
          >
            <Wallet size={32} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">
              Current Balance
            </p>
            <p
              className={`text-2xl font-bold ${balance >= 0 ? "text-white" : "text-red-400"}`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">
            Recent Transactions
          </h2>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No transactions found. Add your first income or expense!
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {transactions.map((t) => (
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
                      {t.categoryName || "General"}
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
    </div>
  );
}
