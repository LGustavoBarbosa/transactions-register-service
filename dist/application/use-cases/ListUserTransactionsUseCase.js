"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListUserTransactionsUseCase = void 0;
class ListUserTransactionsUseCase {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async execute(userId, limit, lastEvaluatedKey) {
        return this.transactionRepository.findByUserId(userId, limit, lastEvaluatedKey);
    }
}
exports.ListUserTransactionsUseCase = ListUserTransactionsUseCase;
