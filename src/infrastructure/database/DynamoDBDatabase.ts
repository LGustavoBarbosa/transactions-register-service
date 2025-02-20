import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const putItem = async (tableName: string, item: any): Promise<void> => {
  await dynamoDB.put({ TableName: tableName, Item: item }).promise();
};

export const queryItems = async (
  params: AWS.DynamoDB.DocumentClient.QueryInput
): Promise<{ Items: any[]; LastEvaluatedKey?: any }> => {
  const result = await dynamoDB.query(params).promise();
  return {
    Items: result.Items || [],
    LastEvaluatedKey: result.LastEvaluatedKey,
  };
};
