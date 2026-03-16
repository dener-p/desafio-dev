import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { db } from '../database/database';
import { transactions, categories } from '../database/schema';
import { eq, and, desc } from 'drizzle-orm';

@Injectable()
export class TransactionsService {
  async create(createTransactionDto: CreateTransactionDto, userId: number) {
    // verify if category exists and belongs to user
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
      throw new NotFoundException(
        'Category not found or does not belong to you',
      );
    }

    const result = await db
      .insert(transactions)
      .values({
        ...createTransactionDto,
        userId,
      })
      .returning();
    return result[0];
  }

  async findAll(userId: number) {
    return db
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
  }

  async findOne(id: number, userId: number) {
    const result = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException(`Transaction #${id} not found`);
    }
    return result[0];
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    userId: number,
  ) {
    await this.findOne(id, userId); // verify existence

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
        throw new NotFoundException(
          'Category not found or does not belong to you',
        );
      }
    }

    const result = await db
      .update(transactions)
      .set(updateTransactionDto)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)))
      .returning();

    return result[0];
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId); // verify existence
    await db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return { success: true };
  }
}
