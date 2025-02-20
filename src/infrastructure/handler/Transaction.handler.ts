import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../../domain/entities/Transaction";
import {
  createTransaction,
  findByUserId,
  findByUserIdAndMonth,
} from "../../domain/repositories/TransactionRepository";

interface Response {
  statusCode: number;
  body: string;
}

export const validateCreateRequest = (
  bodyString: string | null
): { valid: boolean; message?: string } => {
  if (!bodyString) {
    return { valid: false, message: "Request body is required" };
  }
  const body = JSON.parse(bodyString) as Transaction;

  if (!body?.userId) {
    return { valid: false, message: "User ID is required" };
  }
  if (!body?.amount || isNaN(body?.amount)) {
    return {
      valid: false,
      message: "Amount is required and must be a number",
    };
  }
  if (!body?.description) {
    return { valid: false, message: "Description is required" };
  }
  return { valid: true };
};

export const createTransactionHandler = async (
  req: APIGatewayProxyEvent
): Promise<Response> => {
  try {
    const validation = validateCreateRequest(req.body);

    if (!validation.valid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: validation.message }),
      };
    }
    const body = JSON.parse(req.body!) as Transaction;
    const { userId, amount, description } = body;
    const transaction = await createTransaction({
      id: uuidv4(),
      userId,
      amount,
      description,
      createdAt: new Date().toISOString(),
    });

    return {
      statusCode: 201,
      body: JSON.stringify(transaction),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const listTransactionsHandler = async (
  req: APIGatewayProxyEvent
): Promise<Response> => {
  try {
    const { userId, limit, lastEvaluatedKey } = req.queryStringParameters || {};
    const result = await findByUserId(
      userId as string,
      Number(limit),
      lastEvaluatedKey as string
    );
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const calculateBalanceHandler = async (
  req: APIGatewayProxyEvent
): Promise<Response> => {
  try {
    const { userId, month } = req.queryStringParameters || {};
    const balance = await findByUserIdAndMonth(
      userId as string,
      month as string
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        balance: balance.reduce(
          (balance, transaction) => balance + transaction.amount,
          0
        ),
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
