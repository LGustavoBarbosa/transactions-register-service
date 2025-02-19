"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTransactionUseCase = void 0;
const Transaction_1 = require("../../domain/entities/Transaction");
class CreateTransactionUseCase {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async execute(userId, amount, description) {
        const transaction = new Transaction_1.Transaction(undefined, userId, amount, undefined, description);
        await this.transactionRepository.create(transaction);
        return transaction;
    }
}
exports.CreateTransactionUseCase = CreateTransactionUseCase;
