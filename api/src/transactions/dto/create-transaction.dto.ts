import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount!: number;

  @ApiProperty({ enum: ['income', 'expense'] })
  @IsEnum(['income', 'expense'])
  @IsNotEmpty()
  type!: 'income' | 'expense';

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoryId!: number;
}
