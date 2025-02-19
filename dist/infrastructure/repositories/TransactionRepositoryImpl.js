"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepositoryImpl = void 0;
const TABLE_NAME = 'Transactions';
class TransactionRepositoryImpl {
    constructor(database) {
        this.database = database;
    }
    async create(transaction) {
        await this.database.put(TABLE_NAME, transaction);
    }
    async findByUserId(userId, limit = 10, lastEvaluatedKey) {
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: { ':userId': userId },
            Limit: limit,
            ExclusiveStartKey: lastEvaluatedKey ? { id: lastEvaluatedKey } : undefined
        };
        const result = await this.database.query(params);
        return {
            transactions: result.Items,
            lastEvaluatedKey: result.LastEvaluatedKey?.id
        };
    }
}
exports.TransactionRepositoryImpl = TransactionRepositoryImpl;
