import { transactionsSchemas } from '@desafio-dev/shared/transactions-scehamas';
import { createZodDto } from 'nestjs-zod';

export class CreateTransactionDto extends createZodDto(
  transactionsSchemas.createTransaction,
) {}
