import { Transaction } from "../entities/Transaction";
import {
  queryItems,
  putItem,
} from "../../infrastructure/database/DynamoDBDatabase";

const TABLE_NAME = "Transactions";
const INDEX_NAME = "UserIdCreatedAtIndex";

export const createTransaction = async (
  transaction: Transaction
): Promise<void> => {
  await putItem(TABLE_NAME, transaction);
};

export const findByUserId = async (
  userId: string,
  limit = 10,
  lastEvaluatedKey?: string
): Promise<{ transactions: Transaction[]; lastEvaluatedKey?: string }> => {
  const params: any = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId },
    Limit: limit,
  };

  const result = await queryItems(params);
  return {
    transactions: result.Items as Transaction[],
    lastEvaluatedKey: result.LastEvaluatedKey,
  };
};

export const findByUserIdAndMonth = async (
  userId: string,
  month: string
): Promise<Transaction[]> => {
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
  const result = await queryItems(params);
  return result.Items as Transaction[];
};
