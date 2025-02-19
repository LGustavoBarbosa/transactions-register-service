import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class CalculateMonthlyBalanceUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(userId: string, month: string): Promise<number> {
    const transactions = await this.transactionRepository.findByUserIdAndMonth(
      userId,
      month
    );
    return transactions.reduce(
      (balance, transaction) => balance + transaction.amount,
      0
    );
  }
}
