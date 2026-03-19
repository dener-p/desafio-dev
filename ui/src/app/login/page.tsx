"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { userSchemas } from "@desafio-dev/shared/user-schemas";
import { auth } from "@/api/auth";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

type LoginFormData = z.infer<typeof userSchemas.login>;

export default function LoginPage() {
  const login = useMutation(auth.login);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(userSchemas.login),
  });

  const onSubmit = async (data: LoginFormData) => {
    await login.mutateAsync({
      email: data.email,
      password: data.password,
    });

    router.push("/");
  };

  return (
    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-xl mx-auto mt-20">
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            FinTrack
          </h1>
          <p className="text-slate-400 mt-2">
            Faça login para gerenciar suas finanças.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="email@email.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Senha
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={login.isPending}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-transform transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Entra
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Crie uma.
          </Link>
        </p>
      </div>
    </div>
  );
}
