import {
  createTransaction,
  findByUserId,
  findByUserIdAndMonth,
} from "./TransactionRepository";
import { Transaction } from "../entities/Transaction";
import AWS from "aws-sdk";
import AWSMock from "aws-sdk-mock";

AWSMock.setSDKInstance(AWS);

beforeEach(() => {
  AWSMock.restore("DynamoDB.DocumentClient");
  AWS.config.update({ region: "us-east-1" });
});

const mockTransaction: Transaction = {
  id: "1234",
  userId: "123",
  amount: 100,
  createdAt: "2023-10-01",
  description: "Test transaction",
};

describe("Transaction Service", () => {
  describe("createTransaction", () => {
    it("should create a transaction", async () => {
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "put",
        (params: any, callback: any) => {
          callback(null, {});
        }
      );

      await expect(createTransaction(mockTransaction)).resolves.not.toThrow();
    });

    it("should throw an error if DynamoDB put fails", async () => {
      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "put",
        (params: any, callback: any) => {
          callback(new Error("DynamoDB error"));
        }
      );

      await expect(createTransaction(mockTransaction)).rejects.toThrow(
        "DynamoDB error"
      );
    });
  });

  describe("findByUserId", () => {
    it("should return transactions for a given user ID", async () => {
      const mockUserId = "123";

      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: any, callback: any) => {
          callback(null, { Items: [mockTransaction] });
        }
      );

      const result = await findByUserId(mockUserId);
      expect(result.transactions).toEqual([mockTransaction]);
    });

    it("should handle pagination with lastEvaluatedKey", async () => {
      const mockUserId = "123";
      const mockLastEvaluatedKey = { userId: "123", createdAt: "2023-10-01" };

      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: any, callback: any) => {
          callback(null, { Items: [], LastEvaluatedKey: mockLastEvaluatedKey });
        }
      );

      const result = await findByUserId(mockUserId);
      expect(result.lastEvaluatedKey).toEqual(mockLastEvaluatedKey);
    });

    it("should throw an error if DynamoDB query fails", async () => {
      const mockUserId = "123";

      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: any, callback: any) => {
          callback(new Error("DynamoDB error"));
        }
      );

      await expect(findByUserId(mockUserId)).rejects.toThrow("DynamoDB error");
    });
  });

  describe("findByUserIdAndMonth", () => {
    it("should return transactions for a given user ID and month", async () => {
      const mockUserId = "123";
      const mockMonth = "2023-10";

      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: any, callback: any) => {
          callback(null, { Items: [mockTransaction] });
        }
      );

      const result = await findByUserIdAndMonth(mockUserId, mockMonth);
      expect(result).toEqual([mockTransaction]);
    });

    it("should return an empty array if no transactions are found", async () => {
      const mockUserId = "123";
      const mockMonth = "2023-10";

      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: any, callback: any) => {
          callback(null, { Items: [] });
        }
      );

      const result = await findByUserIdAndMonth(mockUserId, mockMonth);
      expect(result).toEqual([]);
    });

    it("should throw an error if DynamoDB query fails", async () => {
      const mockUserId = "123";
      const mockMonth = "2023-10";

      AWSMock.mock(
        "DynamoDB.DocumentClient",
        "query",
        (params: any, callback: any) => {
          callback(new Error("DynamoDB error"));
        }
      );

      await expect(findByUserIdAndMonth(mockUserId, mockMonth)).rejects.toThrow(
        "DynamoDB error"
      );
    });
  });
});
