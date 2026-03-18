import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  controllers: [CategoriesController],
  imports: [TransactionsModule],
  providers: [CategoriesService],
})
export class CategoriesModule {}
