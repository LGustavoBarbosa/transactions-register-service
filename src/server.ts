import AWS from "aws-sdk";
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import {
  createTransactionHandler,
  listTransactionsHandler,
  calculateBalanceHandler,
} from "./infrastructure/handler/Transaction.handler";

AWS.config.update({ region: "us-east-1" });

const router = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const { httpMethod, path } = event;

  if (httpMethod === "POST" && path === "/transactions") {
    return createTransactionHandler(event);
  } else if (httpMethod === "GET" && path === "/transactions") {
    return listTransactionsHandler(event);
  } else if (httpMethod === "GET" && path === "/transactions/balance") {
    return calculateBalanceHandler(event);
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
