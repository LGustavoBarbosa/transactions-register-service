import { v4 as uuidv4 } from "uuid";

export class Transaction {
  constructor(
    public id: string = uuidv4(),
    public userId: string,
    public amount: number,
    public createdAt: string = new Date().toISOString(),
    public description: string
  ) {
    if (amount === 0) throw new Error("Amount cannot be zero");
    if (!description) throw new Error("Description is required");
  }
}
