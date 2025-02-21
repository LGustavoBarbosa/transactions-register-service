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

- **POST https://22k6a49dpi.execute-api.us-east-1.amazonaws.com/dev/api/transactions**: Create a new transaction.
- **GET https://22k6a49dpi.execute-api.us-east-1.amazonaws.com/dev/api/transactions**: List transactions for a user.
- **GET https://22k6a49dpi.execute-api.us-east-1.amazonaws.com/dev/api/transactions/balance**: Calculate the monthly balance for a user.

## License

This project is licensed under the MIT License.
