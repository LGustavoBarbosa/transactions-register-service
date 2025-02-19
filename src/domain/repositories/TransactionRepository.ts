import { Transaction } from "../entities/Transaction";
import { Database } from "../../domain/repositories/Database";

const TABLE_NAME = "Transactions";
const INDEX_NAME = "UserIdCreatedAtIndex";

interface ITransactionRepo {
  create(transaction: Transaction): Promise<void>;
  findByUserId(
    userId: string,
    limit?: number,
    lastEvaluatedKey?: string
  ): Promise<{ transactions: Transaction[]; lastEvaluatedKey?: string }>;
  findByUserIdAndMonth(userId: string, month: string): Promise<Transaction[]>;
}

export class TransactionRepository implements ITransactionRepo {
  constructor(private database: Database) {}

  async create(transaction: Transaction): Promise<void> {
    await this.database.put(TABLE_NAME, transaction);
  }

  async findByUserId(userId: string, limit = 10, lastEvaluatedKey?: string) {
    const params: any = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
      Limit: limit,
    };

    const result = await this.database.query(params);
    return {
      transactions: result.Items as Transaction[],
      lastEvaluatedKey: result.LastEvaluatedKey?.id,
    };
  }

  async findByUserIdAndMonth(
    userId: string,
    month: string
  ): Promise<Transaction[]> {
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;

    const params = {
      TableName: TABLE_NAME,
      IndexName: INDEX_NAME,
      KeyConditionExpression:
        "userId = :userId AND createdAt BETWEEN :startDate AND :endDate",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":startDate": startDate,
        ":endDate": endDate,
      },
    };
    const result = await this.database.query(params);
    return result.Items as Transaction[];
  }
}
