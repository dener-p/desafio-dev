import { transactionsSchemas } from '@desafio-dev/shared/transactions-schemas';
import { createZodDto } from 'nestjs-zod';

export class TransactionResponseDto extends createZodDto(
  transactionsSchemas.transactionResponse,
) {}
