
# CRM Backend - Server Architecture

The **CRM Backend** acts as the Central Data Authority for the platform. It is a robust server-side application built to handle high-concurrency requests, secure authentication, and complex data relationships.

### 1. System Requirements & Environment Setup

Before initializing the project, ensure your local environment meets the following specifications:

* **Node.js Runtime:** Version 18.x or higher is required for compatibility with modern ECMAScript features.
* **PostgreSQL Engine:** Install version 15 or above. Using **pgAdmin 4**, you must manually create a database titled `crm_database` and a corresponding user role.
* **SMTP Configuration:** To enable automated emails, use a Gmail account with **2-Step Verification**. You must generate a **16-character App Password** to bypass standard login security.

### 2. Comprehensive Installation Guide

To set up the application, follow these sequential steps to ensure all dependencies and configurations are correctly mapped:

1. **Clone & Extract:** Move the `crm-backend` folder to your workspace.
2. **Dependency Injection:** Run `npm install` in your terminal. This will pull in **Express** for routing, **Sequelize** as the ORM, **PG** for the Postgres driver, **Bcrypt** for hashing, and **CORS** for cross-origin resource sharing.
3. **Environment Configuration:** Create a `.env` file in the root. This acts as the bridge between your code and your local environment. You must define the following variables:
* `PORT`: The local server port (e.g., 5100).
* `DB_NAME` & `DB_USER`: Your database identity.
* `EMAIL_USER` & `EMAIL_PASS`: Your SMTP credentials for OTP delivery.



### 3. Database Logic & Flow

The architecture relies on an automated synchronization flow to manage the data lifecycle:

* **Sequelize Synchronization:** By using `db.sequelize.sync()`, the system eliminates the need for manual SQL migrations. On the first run, the server inspects your models and automatically generates the tables in PostgreSQL.
* **Authentication Logic:** The Auth Controller follows a strict security protocol. When a user registers, the system hashes the password with a **salt factor of 10**. Simultaneously, it generates a **6-digit OTP** saved with a `createdAt` timestamp, allowing the server to calculate if the code has expired during the verification phase.

### 4. Troubleshooting & Differentiation

Errors are categorized based on whether they stem from the database connection, the mailing server, or data integrity:

* **Connection Errors (`ECONNREFUSED`):** This is typically a service-level issue. If the server cannot reach `127.0.0.1:5432`, ensure the PostgreSQL service is "Running" in your OS Services menu.
* **Authentication Errors (`535-5.7.8`):** This differentiates between a standard password and an App Password. The SMTP server will reject your standard Gmail login; you must use the specific 16-character code generated in your Google Security settings.
* **Validation Errors (`SequelizeValidationError`):** This signifies a schema mismatch. It occurs when the data type sent from the frontend (e.g., a string) does not align with the integer or boolean constraints defined in your backend models.

---
