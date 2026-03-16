import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { db } from '../database/database';
import { categories } from '../database/schema';
import { eq, and } from 'drizzle-orm';

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
      throw new NotFoundException(`Category #${id} not found`);
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
    await this.findOne(id, userId); // check exists
    await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)));
    return { success: true };
  }
}
