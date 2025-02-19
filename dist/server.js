"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const DynamoDBDatabase_1 = require("./infrastructure/database/DynamoDBDatabase");
const TransactionRepository_1 = require("./domain/repositories/TransactionRepository");
const CreateTransactionUseCase_1 = require("./application/use-cases/CreateTransactionUseCase");
const ListUserTransactionsUseCase_1 = require("./application/use-cases/ListUserTransactionsUseCase");
const CalculateMonthlyBalanceUseCase_1 = require("./application/use-cases/CalculateMonthlyBalanceUseCase");
const TransactionController_1 = require("./infrastructure/controllers/TransactionController");
aws_sdk_1.default.config.update({ region: "us-east-1" });
const database = new DynamoDBDatabase_1.DynamoDBDatabase();
const repository = new TransactionRepository_1.TransactionRepository(database);
const createTransaction = new CreateTransactionUseCase_1.CreateTransactionUseCase(repository);
const listTransactions = new ListUserTransactionsUseCase_1.ListUserTransactionsUseCase(repository);
const calculateBalance = new CalculateMonthlyBalanceUseCase_1.CalculateMonthlyBalanceUseCase(repository);
const controller = new TransactionController_1.TransactionController(createTransaction, listTransactions, calculateBalance);
const router = async (event) => {
    const { httpMethod, path } = event;
    if (httpMethod === "POST" && path === "/transactions") {
        return controller.create(event);
    }
    else if (httpMethod === "GET" && path === "/transactions") {
        return controller.list(event);
    }
    else if (httpMethod === "GET" && path === "/transactions/balance") {
        return controller.calculateBalance(event);
    }
    else {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Not Found" }),
        };
    }
};
const handler = async (event) => {
    return router(event);
};
exports.handler = handler;
