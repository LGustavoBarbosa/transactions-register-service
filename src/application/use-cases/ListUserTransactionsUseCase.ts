import { TransactionRepository } from "../../domain/repositories/TransactionRepository";

export class ListUserTransactionsUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(userId: string, limit?: number, lastEvaluatedKey?: string) {
    return this.transactionRepository.findByUserId(
      userId,
      limit,
      lastEvaluatedKey
    );
  }
}
