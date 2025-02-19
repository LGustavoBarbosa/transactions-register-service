"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const uuid_1 = require("uuid");
class Transaction {
    constructor(id = (0, uuid_1.v4)(), userId, amount, createdAt = new Date(), description) {
        this.id = id;
        this.userId = userId;
        this.amount = amount;
        this.createdAt = createdAt;
        this.description = description;
        if (amount === 0)
            throw new Error('Amount cannot be zero');
        if (!description)
            throw new Error('Description is required');
    }
}
exports.Transaction = Transaction;
