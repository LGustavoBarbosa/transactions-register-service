"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const TABLE_NAME = "Transactions";
class TransactionRepository {
    constructor(database) {
        this.database = database;
    }
    async create(transaction) {
        await this.database.put(TABLE_NAME, transaction);
    }
    async findByUserId(userId, limit = 10, lastEvaluatedKey) {
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: { ":userId": userId },
            Limit: limit,
        };
        const result = await this.database.query(params);
        return {
            transactions: result.Items,
            lastEvaluatedKey: result.LastEvaluatedKey?.id,
        };
    }
    async findByUserIdAndMonth(userId, month) {
        const startDate = `${month}-01`;
        const endDate = `${month}-31`;
        const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "userId = :userId AND createdAt BETWEEN :startDate AND :endDate",
            ExpressionAttributeValues: {
                ":userId": userId,
                ":startDate": startDate,
                ":endDate": endDate,
            },
        };
        const result = await this.database.query(params);
        return result.Items;
    }
}
exports.TransactionRepository = TransactionRepository;
