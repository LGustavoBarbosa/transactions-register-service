"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
class TransactionController {
    constructor(createTransaction, listTransactions, calculateMonthlyBalance) {
        this.createTransaction = createTransaction;
        this.listTransactions = listTransactions;
        this.calculateMonthlyBalance = calculateMonthlyBalance;
    }
    validateCreateRequest(bodyString) {
        if (!bodyString) {
            return { valid: false, message: "Request body is required" };
        }
        const body = JSON.parse(bodyString);
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
    async create(req) {
        try {
            const validation = this.validateCreateRequest(req.body);
            if (!validation.valid) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: validation.message }),
                };
            }
            const body = JSON.parse(req.body);
            const { userId, amount, description } = body;
            const transaction = await this.createTransaction.execute(userId, amount, description);
            return {
                statusCode: 201,
                body: JSON.stringify(transaction),
            };
        }
        catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message }),
            };
        }
    }
    async list(req) {
        try {
            const { userId, limit, lastEvaluatedKey } = req.queryStringParameters || {};
            const result = await this.listTransactions.execute(userId, Number(limit), lastEvaluatedKey);
            return {
                statusCode: 200,
                body: JSON.stringify(result),
            };
        }
        catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message }),
            };
        }
    }
    async calculateBalance(req) {
        try {
            const { userId, month } = req.queryStringParameters || {};
            const balance = await this.calculateMonthlyBalance.execute(userId, month);
            return {
                statusCode: 200,
                body: JSON.stringify({ balance }),
            };
        }
        catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: error.message }),
            };
        }
    }
}
exports.TransactionController = TransactionController;
