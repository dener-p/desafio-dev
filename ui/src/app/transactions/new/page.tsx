'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

const transactionSchema = z.object({
  description: z.string().min(2, 'Description must be at least 2 characters'),
  amount: z.number().min(0.01, 'Amount must be greater than zero'),
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, 'Date is required'),
  categoryId: z.number().min(1, 'Please select a category'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface Category {
  id: number;
  name: string;
}

export default function NewTransactionPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    }
  });

  useEffect(() => {
    if (user) {
      api.get('/categories').then(({ data }) => setCategories(data)).catch(console.error);
    }
  }, [user]);

  const onSubmit = async (data: TransactionFormData) => {
    try {
      // API expects amount in cents
      const payload = {
        ...data,
        amount: Math.round(data.amount * 100)
      };
      await api.post('/transactions', payload);
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Error saving transaction. Check console.');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">New Transaction</h1>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select 
                {...register('type')}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
              <input 
                {...register('date')}
                type="date" 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow [color-scheme:dark]"
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <input 
              {...register('description')}
              type="text" 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="What was this for?"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Amount (R$)</label>
              <input 
                {...register('amount', { valueAsNumber: true })}
                type="number" 
                step="0.01"
                min="0.01"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-xl font-medium"
                placeholder="0.00"
              />
              {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1 flex justify-between">
                Category
                <Link href="/categories" className="text-blue-400 text-xs hover:underline">Manage</Link>
              </label>
              <select 
                {...register('categoryId', { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow appearance-none"
              >
                <option value="">Select a category...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-400 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition-transform transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              <Plus size={20} />
              {isSubmitting ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
