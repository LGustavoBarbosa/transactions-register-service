import { CreateTransactionUseCase } from "../../application/use-cases/CreateTransactionUseCase";
import { APIGatewayProxyEvent } from "aws-lambda";
import { ListUserTransactionsUseCase } from "../../application/use-cases/ListUserTransactionsUseCase";
import { CalculateMonthlyBalanceUseCase } from "../../application/use-cases/CalculateMonthlyBalanceUseCase";
import { Transaction } from "../../domain/entities/Transaction";

interface Response {
  statusCode: number;
  body: string;
}

interface ITransactionController {
  create(req: APIGatewayProxyEvent): Promise<Response>;
  list(req: APIGatewayProxyEvent): Promise<Response>;
  calculateBalance(req: APIGatewayProxyEvent): Promise<Response>;
}

export class TransactionController implements ITransactionController {
  constructor(
    private createTransaction: CreateTransactionUseCase,
    private listTransactions: ListUserTransactionsUseCase,
    private calculateMonthlyBalance: CalculateMonthlyBalanceUseCase
  ) {}

  private validateCreateRequest(bodyString: string | null): {
    valid: boolean;
    message?: string;
  } {
    if (!bodyString) {
      return { valid: false, message: "Request body is required" };
    }
    const body = JSON.parse(bodyString!) as Transaction;

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
  }

  async create(req: APIGatewayProxyEvent): Promise<Response> {
    try {
      const validation = this.validateCreateRequest(req.body);

      if (!validation.valid) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: validation.message }),
        };
      }
      const body = JSON.parse(req.body!) as Transaction;
      const { userId, amount, description } = body;
      const transaction = await this.createTransaction.execute(
        userId,
        amount,
        description
      );

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
  }

  async list(req: APIGatewayProxyEvent): Promise<Response> {
    try {
      const { userId, limit, lastEvaluatedKey } =
        req.queryStringParameters || {};
      const result = await this.listTransactions.execute(
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
  }

  async calculateBalance(req: APIGatewayProxyEvent): Promise<Response> {
    try {
      const { userId, month } = req.queryStringParameters || {};
      const balance = await this.calculateMonthlyBalance.execute(
        userId as string,
        month as string
      );
      return {
        statusCode: 200,
        body: JSON.stringify({ balance }),
      };
    } catch (error: any) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }
}
