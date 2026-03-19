import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { db } from '../database/database';
import { categories, transactions } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import { AppException } from 'src/app.exception';

@Injectable()
export class CategoriesService {
  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    const result = await db
      .insert(categories)
      .values({
        name: createCategoryDto.name,

        userId,
      })
      .returning();
    return result[0];
  }

  async findAll(userId: number) {
    return db.select().from(categories).where(eq(categories.userId, userId));
  }

  async findOne(id: number, userId: number) {
    const result = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .limit(1);
    if (!result.length) {
      throw new AppException({
        cause: 'NotFound',
        message: 'Categoria não encontrada.',
      });
    }
    return result[0];
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    await this.findOne(id, userId);
    const result = await db
      .update(categories)
      .set({ name: updateCategoryDto.name })
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    return result[0];
  }
  private async findTransactionByCategoryId(
    categoryId: number,
    userId: number,
  ) {
    const [res] = await db
      .select({ id: transactions.id })
      .from(transactions)
      .where(
        and(
          eq(transactions.categoryId, categoryId),
          eq(transactions.userId, userId),
        ),
      );

    // typescript...
    return res ?? null;
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    const hasTransaction = await this.findTransactionByCategoryId(id, userId);
    if (hasTransaction) {
      throw new AppException({
        // probabily needs a better name
        cause: 'CategoryInUse',
        message:
          'Categoria está sendo usado por uma transação e não pode ser excluíoda.',
      });
    }
    // in production use soft delete.
    await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)));
    return { success: true };
  }
}
