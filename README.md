Banking Ledger System

Backend project built to understand how transaction systems and ledger-based accounting work internally.

The main focus of this project was:

* handling money transfers safely
* understanding double-entry bookkeeping
* preventing duplicate transactions
* learning transaction consistency with MongoDB sessions

Built using Node.js, Express, MongoDB, and Mongoose.

⸻

Features

* User authentication with JWT
* Refresh token support
* Blacklisted token handling
* Account-to-account transfer
* Double-entry ledger system
* Idempotency key support
* MongoDB transactions/sessions
* Rate limiting
* REST APIs

⸻

Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Render

⸻

How Balance Works

Instead of storing account balance directly, balance is calculated from ledger transactions.

Each transfer creates:

* one debit entry
* one credit entry

This helped me understand how financial systems maintain consistency and transaction history.

⸻

Why Double Entry?

I implemented double-entry bookkeeping so that every transfer has both:

* debit
* credit

This reduces chances of inconsistent transactions and keeps the ledger traceable.

Example:

A sends 500 to B
A -> Debit 500
B -> Credit 500

⸻

Atomic Transactions

Transfers use MongoDB sessions/transactions.

If any operation fails during transfer:

* transaction rolls back
* partial updates are avoided

Example:

* debit success
* credit fails
* rollback entire transaction

⸻

Idempotency

To prevent duplicate transfers during retries or network issues, idempotency keys are used.

If the same request is sent multiple times with the same key, duplicate transactions are avoided.

⸻

Business logic is mainly handled inside the service layer.

⸻

API Examples

POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/transactions/transfer
GET /api/v1/accounts/balance
GET /api/v1/transactions/history


Security

* Password hashing
* JWT authentication
* Refresh tokens
* Token blacklisting
* Environment variables for secrets
* Rate limiting middleware


Why MongoDB?

I wanted to explore transaction handling and consistency using MongoDB sessions instead of using PostgreSQL again.

Although relational databases are generally more common for financial systems, this project was mainly for learning transaction handling with MongoDB.


Limitations

This project was built mainly for learning backend architecture and transaction systems.

Things still missing/improvable:

* better concurrency handling
* automated tests
* balance snapshot optimization
* logging/monitoring
* Redis caching
* Docker setup

What I Learned

* transaction consistency
* ledger-based accounting basics
* MongoDB transactions/sessions
* idempotency handling
* backend architecture structuring
* JWT authentication flow


Deployment

Hosted on Render.