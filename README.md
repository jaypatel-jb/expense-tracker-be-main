# Expense Tracker Backend Documentation

## Project Structure
```
expense-tracker-be/
├─ src/
│  ├─ controllers/
│  │  ├─ category.controller.ts
│  │  ├─ dashboard.controller.ts
│  │  ├─ expense.controller.ts
│  │  └─ user.controller.ts
│  ├─ database/
│  │  └─ db.ts
│  ├─ lib/
│  │  └─ utils.ts
│  ├─ middlewares/
│  │  └─ validateWithZod.ts
│  ├─ models/
│  │  ├─ category.model.ts
│  │  ├─ expense.model.ts
│  │  └─ user.modal.ts
│  ├─ routes/
│  │  ├─ category.routes.ts
│  │  ├─ dashboard.routes.ts
│  │  ├─ expense.routes.ts
│  │  └─ user.routes.ts
│  ├─ schemas/
│  │  ├─ category.schema.ts
│  │  ├─ expense.schema.ts
│  │  └─ user.schema.ts
│  └─ server.ts
├─ .env
├─ .eslintignore
├─ .eslintrc.json
├─ .prettierrc.json
├─ nodemon.json
├─ package-lock.json
├─ package.json
├─ tsconfig.json
```

## Description
This is a backend service for an Expense Tracker application built using Node.js and TypeScript. It provides API endpoints for managing users, expenses, categories, and dashboard statistics.

## Technologies Used
- **Node.js**
- **TypeScript**
- **Express.js**
- **Zod** (for validation)
- **MySQL** (Database)

## Setup & Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/expense-tracker-be.git
   cd expense-tracker-be
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=expenses-tacker
   PORT=5000
   ```
4. Start the development server:
   ```sh
   npm run start:dev
   ```

## Dashboard Queries Explanation

### **1. Top 3 Spending Days per User (`Statistics1`)**
This query retrieves the top 3 days with the highest spending for each user.

#### **Step-by-Step Breakdown:**
1. **Calculate daily total spending per user:**
   ```sql
   SELECT e.user_id, u.name AS user_name, e.date, SUM(e.amount) AS total_spent
   FROM expenses e
   JOIN users u ON e.user_id = u.id
   GROUP BY e.user_id, e.date;
   ```
2. **Rank each spending day per user:**
   ```sql
   ROW_NUMBER() OVER (PARTITION BY e.user_id ORDER BY SUM(e.amount) DESC) AS `rank`
   ```
3. **Filter only the top 3 highest spending days per user:**
   ```sql
   WHERE `rank` <= 3;
   ```

### **2. Monthly Expenditure Percentage Change (`Statistics2`)**
This query calculates the percentage change in spending month-over-month for each user.

#### **Step-by-Step Breakdown:**
1. **Summarize expenses per user per month:**
   ```sql
   SELECT e.user_id, u.name AS user_name, DATE_FORMAT(e.date, '%Y-%m') AS month, SUM(e.amount) AS total_spent
   FROM expenses e
   JOIN users u ON e.user_id = u.id
   GROUP BY e.user_id, u.name, DATE_FORMAT(e.date, '%Y-%m');
   ```
2. **Retrieve the previous month’s spending for each user:**
   ```sql
   LAG(me.total_spent) OVER (PARTITION BY me.user_id ORDER BY me.month) AS previous_month_spent
   ```
3. **Calculate the percentage change in spending:**
   ```sql
   CASE WHEN previous_month_spent IS NOT NULL THEN 
        ROUND(((me.total_spent - previous_month_spent) / previous_month_spent) * 100, 2) 
   ELSE NULL END AS percentage_change;
   ```

### **3. Predicted Next Month's Spending (`Statistics3`)**
This query predicts the next month’s spending based on the last 3 months’ average.

#### **Step-by-Step Breakdown:**
1. **Summarize expenses per user per month:**
   ```sql
   SELECT e.user_id, u.name AS user_name, DATE_FORMAT(e.date, '%Y-%m') AS month, SUM(e.amount) AS total_spent
   FROM expenses e
   JOIN users u ON e.user_id = u.id
   GROUP BY e.user_id, u.name, DATE_FORMAT(e.date, '%Y-%m');
   ```
2. **Calculate the 3-month rolling average:**
   ```sql
   ROUND(AVG(me.total_spent) OVER (
      PARTITION BY me.user_id ORDER BY STR_TO_DATE(me.month, '%Y-%m')
      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
   ), 2) AS avg_last_3_months;
   ```
3. **Predict the spending for the next month:**
   ```sql
   DATE_FORMAT(DATE_ADD(STR_TO_DATE(CONCAT(month, '-01'), '%Y-%m-%d'), INTERVAL 1 MONTH), '%Y-%m') AS predicted_month,
   IFNULL(avg_last_3_months, 0) AS predicted_spending;
   ```

This query helps estimate future spending based on historical data trends.

## API Endpoints
- `GET /api/dashboard/statistics1` - Get top 3 spending days per user
- `GET /api/dashboard/statistics2` - Get monthly spending percentage change
- `GET /api/dashboard/statistics3` - Predict next month's spending

## Validation & Error Handling
- Uses **Zod** for request body validation
- Middleware (`validateWithZod.ts`) ensures valid input data
- Express error handling middleware ensures consistent API error responses


