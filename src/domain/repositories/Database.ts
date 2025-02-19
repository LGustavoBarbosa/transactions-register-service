export interface Database {
    put(tableName: string, item: any): Promise<void>;
    query(params: any): Promise<{ Items: any[], LastEvaluatedKey?: any }>; 
}