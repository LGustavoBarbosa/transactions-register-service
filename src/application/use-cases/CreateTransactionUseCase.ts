import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class CreateTransactionUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(userId: string, amount: number, description: string) {
    const transaction = new Transaction(
      undefined,
      userId,
      amount,
      undefined,
      description
    );
    await this.transactionRepository.create(transaction);
    return transaction;
  }
}
