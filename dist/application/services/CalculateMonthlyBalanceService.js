"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateMonthlyBalanceService = void 0;
const TABLE_NAME = 'Transactions';
class CalculateMonthlyBalanceService {
    constructor(database) {
        this.database = database;
    }
    async execute(userId, month) {
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: 'userId = :userId AND begins_with(createdAt, :month)',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':month': month
            }
        };
        const result = await this.database.query(params);
        const transactions = result.Items;
        return transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    }
}
exports.CalculateMonthlyBalanceService = CalculateMonthlyBalanceService;
