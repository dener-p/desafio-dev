import { Injectable } from '@nestjs/common';
import type { CreateTransactionDto } from './dto/create-transaction.dto';
import type { UpdateTransactionDto } from './dto/update-transaction.dto';
import { db } from '../database/database';
import { transactions, categories } from '../database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { AppException } from 'src/app.exception';

@Injectable()
export class TransactionsService {
  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    // doing this to not get circular depedences...
    const category = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, createTransactionDto.categoryId),
          eq(categories.userId, userId),
        ),
      )
      .limit(1);

    if (!category.length) {
      throw new AppException({
        message: 'Categoria não encontrada.',
        cause: 'CategoryNotFound',
      });
    }

    const result = await db
      .insert(transactions)
      .values({
        ...createTransactionDto,
        amount: Math.floor(createTransactionDto.amount * 100),
        userId,
      })
      .returning();
    return result[0];
  }

  async findAll(userId: number) {
    // Should add pagination here...
    const data = await db
      .select({
        id: transactions.id,
        description: transactions.description,
        amount: transactions.amount,
        type: transactions.type,
        date: transactions.date,
        categoryId: transactions.categoryId,
        categoryName: categories.name,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date));
    return data.map((d) => ({ ...d, amount: d.amount / 100 }));
  }

  async findOne(id: number, userId: number) {
    const result = await db
      .select({
        id: transactions.id,
        description: transactions.description,
        amount: transactions.amount,
        type: transactions.type,
        date: transactions.date,
        categoryId: transactions.categoryId,
        categoryName: categories.name,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .limit(1);

    if (!result.length) {
      throw new AppException({
        message: 'Transação não encontrada',
        cause: 'TransactioinNotFound',
      });
    }
    const data = result[0];
    return {
      ...data,
      amount: data.amount / 100,
    };
  }

  async findByCategoryId(categoryId: number, userId: number) {
    const [result] = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.categoryId, categoryId),
          eq(transactions.userId, userId),
        ),
      )
      .limit(1);

    // typescript
    return result ?? null;
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    userId: number,
  ) {
    const res = await this.findOne(id, userId);

    if (updateTransactionDto.categoryId) {
      const category = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.id, updateTransactionDto.categoryId),
            eq(categories.userId, userId),
          ),
        )
        .limit(1);

      if (!category.length) {
        throw new AppException({
          cause: 'CategoryNotFound',
          message: 'Categoria não encontrada.',
        });
      }
    }

    const result = await db
      .update(transactions)
      .set({
        ...updateTransactionDto,
        amount: updateTransactionDto.amount
          ? Math.floor(updateTransactionDto.amount * 100)
          : res.amount,
      })
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();

    return result[0];
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return { success: true };
  }
}
