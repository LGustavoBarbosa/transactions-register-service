import AWS from 'aws-sdk';
import { Database } from '../../domain/repositories/Database';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export class DynamoDBDatabase implements Database {
    async put(tableName: string, item: any): Promise<void> {
        await dynamoDB.put({ TableName: tableName, Item: item }).promise();
    }

    async query(params: AWS.DynamoDB.DocumentClient.QueryInput): Promise<{ Items: any[], LastEvaluatedKey?: any }> {
        const result = await dynamoDB.query(params).promise();
        return { Items: result.Items || [], LastEvaluatedKey: result.LastEvaluatedKey };
    }
}