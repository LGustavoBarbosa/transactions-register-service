jest.mock("../../infrastructure/database/DynamoDBDatabase", () => ({
  queryItems: jest.fn(),
  putItem: jest.fn(),
}));

import {
  putItem,
  queryItems,
} from "../../infrastructure/database/DynamoDBDatabase";
import {
  createTransaction,
  findByUserId,
  findByUserIdAndMonth,
} from "./TransactionRepository";
import { Transaction } from "../entities/Transaction";

describe("TransactionRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTransaction", () => {
    it("deve chamar putItem com os parâmetros corretos", async () => {
      const mockTransaction: Transaction = {
        id: "1",
        userId: "123",
        amount: 100,
        createdAt: "2023-10-01",
        description: "Teste",
      };

      await createTransaction(mockTransaction);
      expect(putItem).toHaveBeenCalledWith("Transactions", mockTransaction);
    });

    it("deve lançar erro se putItem falhar", async () => {
      (putItem as jest.Mock).mockRejectedValue(new Error("Erro no putItem"));
      await expect(createTransaction({} as Transaction)).rejects.toThrow(
        "Erro no putItem"
      );
    });
  });

  describe("findByUserId", () => {
    it("deve retornar transações e lastEvaluatedKey corretamente", async () => {
      const mockResult = {
        Items: [{ id: "1" }],
        LastEvaluatedKey: { id: "1" },
      };
      (queryItems as jest.Mock).mockResolvedValue(mockResult);

      const response = await findByUserId("123");
      expect(queryItems).toHaveBeenCalledWith({
        TableName: "Transactions",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": "123" },
        Limit: 10,
      });
      expect(response).toEqual({
        transactions: mockResult.Items,
        lastEvaluatedKey: mockResult.LastEvaluatedKey,
      });
    });

    it("deve lançar erro se queryItems falhar", async () => {
      (queryItems as jest.Mock).mockRejectedValue(
        new Error("Erro no queryItems")
      );
      await expect(findByUserId("123")).rejects.toThrow("Erro no queryItems");
    });
  });

  describe("findByUserIdAndMonth", () => {
    it("deve retornar itens corretamente", async () => {
      const mockResult = {
        Items: [{ id: "1", userId: "123", createdAt: "2023-10-10" }],
      };
      (queryItems as jest.Mock).mockResolvedValue(mockResult);

      const response = await findByUserIdAndMonth("123", "2023-10");
      expect(queryItems).toHaveBeenCalledWith({
        TableName: "Transactions",
        IndexName: "UserIdCreatedAtIndex",
        KeyConditionExpression:
          "userId = :userId AND createdAt BETWEEN :startDate AND :endDate",
        ExpressionAttributeValues: {
          ":userId": "123",
          ":startDate": "2023-10-01",
          ":endDate": "2023-10-31",
        },
      });
      expect(response).toEqual(mockResult.Items);
    });

    it("deve lançar erro se queryItems falhar", async () => {
      (queryItems as jest.Mock).mockRejectedValue(
        new Error("Erro no queryItems")
      );
      await expect(findByUserIdAndMonth("123", "2023-10")).rejects.toThrow(
        "Erro no queryItems"
      );
    });
  });
});
