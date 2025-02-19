"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
const setupRoutes = (controller) => {
    router.post('/transactions', (req, res) => controller.create(req, res));
    router.get('/transactions', (req, res) => controller.list(req, res));
    router.get('/transactions/balance', (req, res) => controller.calculateBalance(req, res));
    return router;
};
exports.setupRoutes = setupRoutes;
