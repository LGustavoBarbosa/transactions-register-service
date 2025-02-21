# My Project

This project is a financial transaction management system built using TypeScript, Terraform, AWS, Dynamondb, Lambda, API Gateway. It allows users to create transactions, list their transactions, and calculate their monthly balance.

## Features

- **Create Transactions**: Users can create new financial transactions with an amount and description.
- **List Transactions**: Users can retrieve a list of their transactions with pagination support.
- **Calculate Monthly Balance**: Users can calculate their total balance for a specific month.

## Installation

1. Clone the repository:

2. Install the dependencies:
   ```
   npm install
   ```

## Usage local

1. run docker-compose up
2. run terraform init && terraform apply

## API Endpoints

- Collection postman
  https://www.postman.com/gflashwolf/workspace/transactions-aws/collection/4557313-5e3f4396-ae03-4550-8e9c-3dba5ba6ed14?action=share&creator=4557313&active-environment=4557313-0dc1aa58-1bd8-4a38-84ed-e5c70b73cbf1
- **POST https://22k6a49dpi.execute-api.us-east-1.amazonaws.com/dev/api/transactions**: Create a new transaction.
- **GET https://22k6a49dpi.execute-api.us-east-1.amazonaws.com/dev/api/transactions**: List transactions for a user.
- **GET https://22k6a49dpi.execute-api.us-east-1.amazonaws.com/dev/api/transactions/balance**: Calculate the monthly balance for a user.

## License

This project is licensed under the MIT License.
