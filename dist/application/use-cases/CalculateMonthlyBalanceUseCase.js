"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateMonthlyBalanceUseCase = void 0;
class CalculateMonthlyBalanceUseCase {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async execute(userId, month) {
        const transactions = await this.transactionRepository.findByUserIdAndMonth(userId, month);
        return transactions.reduce((balance, transaction) => balance + transaction.amount, 0);
    }
}
exports.CalculateMonthlyBalanceUseCase = CalculateMonthlyBalanceUseCase;
