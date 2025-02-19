# My Project

This project is a financial transaction management system built using TypeScript and Express. It allows users to create transactions, list their transactions, and calculate their monthly balance.

## Features

- **Create Transactions**: Users can create new financial transactions with an amount and description.
- **List Transactions**: Users can retrieve a list of their transactions with pagination support.
- **Calculate Monthly Balance**: Users can calculate their total balance for a specific month.

## Project Structure

```
my-project
├── src
│   ├── application
│   │   ├── services
│   │   │   └── CalculateMonthlyBalanceService.ts
│   │   └── use-cases
│   │       ├── CreateTransactionUseCase.ts
│   │       └── ListUserTransactionsUseCase.ts
│   ├── domain
│   │   ├── entities
│   │   │   └── Transaction.ts
│   │   └── repositories
│   │       ├── Database.ts
│   │       └── TransactionRepository.ts
│   ├── infrastructure
│   │   ├── controllers
│   │   │   └── TransactionController.ts
│   │   ├── database
│   │   │   └── DynamoDBDatabase.ts
│   │   └── repositories
│   │       └── TransactionRepositoryImpl.ts
│   ├── interfaces
│   │   └── http
│   │       └── routes.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd my-project
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the server, run:
```
npm start
```

The server will be running on `http://localhost:3000`.

## API Endpoints

- **POST /api/transactions**: Create a new transaction.
- **GET /api/transactions**: List transactions for a user.
- **GET /api/transactions/balance**: Calculate the monthly balance for a user.

## License

This project is licensed under the MIT License.