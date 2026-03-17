import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create category' })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.categoriesService.create(createCategoryDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all user categories' })
  findAll(@Req() req: { user: { id: number } }) {
    return this.categoriesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  findOne(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    return this.categoriesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category by ID' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.categoriesService.update(+id, updateCategoryDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category by ID' })
  remove(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    return this.categoriesService.remove(+id, req.user.id);
  }
}
