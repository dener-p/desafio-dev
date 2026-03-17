import { categoriesSchema } from '@desafio-dev/shared/categories-schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateCategoryDto extends createZodDto(
  categoriesSchema.createCategory,
) {}
