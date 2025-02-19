import AWS from "aws-sdk";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDBDatabase } from "./infrastructure/database/DynamoDBDatabase";
import { TransactionRepository } from "./domain/repositories/TransactionRepository";
import { CreateTransactionUseCase } from "./application/use-cases/CreateTransactionUseCase";
import { ListUserTransactionsUseCase } from "./application/use-cases/ListUserTransactionsUseCase";
import { CalculateMonthlyBalanceUseCase } from "./application/use-cases/CalculateMonthlyBalanceUseCase";
import { TransactionController } from "./infrastructure/controllers/TransactionController";

AWS.config.update({ region: "us-east-1" });

const database = new DynamoDBDatabase();
const repository = new TransactionRepository(database);
const createTransaction = new CreateTransactionUseCase(repository);
const listTransactions = new ListUserTransactionsUseCase(repository);
const calculateBalance = new CalculateMonthlyBalanceUseCase(repository);

const controller = new TransactionController(
  createTransaction,
  listTransactions,
  calculateBalance
);

const router = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { httpMethod, path } = event;

  if (httpMethod === "POST" && path === "/transactions") {
    return controller.create(event);
  } else if (httpMethod === "GET" && path === "/transactions") {
    return controller.list(event);
  } else if (httpMethod === "GET" && path === "/transactions/balance") {
    return controller.calculateBalance(event);
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Not Found" }),
    };
  }
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  return router(event);
};
