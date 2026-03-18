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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { AppException } from 'src/app.exception';
import { DefaultResponseDto } from 'src/dto/default-response.dto';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  @ZodResponse({ type: TransactionResponseDto })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: { user: { id: number } },
  ) {
    return this.transactionsService.create(createTransactionDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all user transactions' })
  @ZodResponse({ type: [TransactionResponseDto] })
  findAll(@Req() req: { user: { id: number } }) {
    return this.transactionsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ZodResponse({ type: TransactionResponseDto })
  findOne(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    return this.transactionsService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update transaction by ID' })
  @ZodResponse({ type: DefaultResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Req() req: { user: { id: number } },
  ) {
    // probabily add this to a helper function/class
    const idNumber = Number(id);
    if (Number.isNaN(idNumber)) {
      throw new AppException({
        message: 'id deve ser um número',
        cause: 'VALIDATION',
      });
    }
    await this.transactionsService.update(
      idNumber,
      updateTransactionDto,
      req.user.id,
    );
    return { msg: 'Transação atualizada com sucesso.' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transaction by ID' })
  @ZodResponse({ type: DefaultResponseDto })
  async remove(@Param('id') id: string, @Req() req: { user: { id: number } }) {
    await this.transactionsService.remove(+id, req.user.id);
    return { msg: 'Transação removida com sucesso.' };
  }
}
