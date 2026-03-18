import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { db } from '../database/database';
import { categories } from '../database/schema';
import { eq, and } from 'drizzle-orm';
import { AppException } from 'src/app.exception';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly transactionsService: TransactionsService, // 👈
  ) {}
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
    await this.findOne(id, userId); // check exists
    const result = await db
      .update(categories)
      .set({ name: updateCategoryDto.name })
      .where(and(eq(categories.id, id), eq(categories.userId, userId)))
      .returning();
    return result[0];
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    const hasTransaction = await this.transactionsService.findOne(id, userId);
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
