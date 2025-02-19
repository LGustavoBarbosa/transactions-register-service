"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDBDatabase = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient();
class DynamoDBDatabase {
    async put(tableName, item) {
        await dynamoDB.put({ TableName: tableName, Item: item }).promise();
    }
    async query(params) {
        const result = await dynamoDB.query(params).promise();
        return { Items: result.Items || [], LastEvaluatedKey: result.LastEvaluatedKey };
    }
}
exports.DynamoDBDatabase = DynamoDBDatabase;
