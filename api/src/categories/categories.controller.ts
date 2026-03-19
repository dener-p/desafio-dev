import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { CategoryResponseDto } from './dto/category-response.dto';
import { DefaultResponseDto } from 'src/dto/default-response.dto';
import { AppException } from 'src/app.exception';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @ZodResponse({ type: CreateCategoryDto })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.categoriesService.create(createCategoryDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all user categories' })
  @ZodResponse({ type: [CategoryResponseDto] })
  findAll(@Req() req: { user: { id: number } }) {
    return this.categoriesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ZodResponse({ type: CategoryResponseDto })
  findOne(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    const idNumber = Number(id);
    if (Number.isNaN(idNumber)) {
      throw new AppException({
        message: 'id must be a number',
        cause: 'VALIDATION',
      });
    }
    return this.categoriesService.findOne(idNumber, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category by ID' })
  @ZodResponse({ type: DefaultResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: { user: { id: number } },
  ) {
    const idNumber = Number(id);
    if (Number.isNaN(idNumber)) {
      throw new AppException({
        message: 'id must be a number',
        cause: 'VALIDATION',
      });
    }
    await this.categoriesService.update(
      idNumber,
      updateCategoryDto,
      req.user.id,
    );

    return { msg: 'Categoria modificada com sucesso!' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by ID' })
  @ZodResponse({ type: DefaultResponseDto })
  async remove(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    const idNumber = Number(id);
    if (Number.isNaN(idNumber)) {
      throw new AppException({
        message: 'id must be a number',
        cause: 'VALIDATION',
      });
    }
    await this.categoriesService.remove(idNumber, req.user.id);
    return { msg: 'Categoria deletada com sucesso!' };
  }
}
