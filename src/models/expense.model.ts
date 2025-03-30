import { DB } from "../database/db"

export class ExpenseModel {
  static async createExpense(user_id: number, category_id: number, amount: number, date: Date, description: string) {
    try {
      const connection = DB()
      const query = `INSERT INTO expenses (user_id, category_id, amount,date,description) VALUES (?, ?, ?,?,?)`
      const [result] = await connection.execute(query, [user_id, category_id, amount, date, description])
      console.log(result)
      return result
    } catch (error) {
      throw error
    }
  }

  static async getAllExpense(
    filter: { search?: string; email?: string; users?: string[]; category?: string[]; dateRange?: string[] } = {}
  ) {
    try {
      const connection = DB();
      let query = `
        SELECT expenses.*, users.name AS user_name, users.email, categories.name AS category_name 
        FROM expenses 
        JOIN users ON expenses.user_id = users.id 
        JOIN categories ON expenses.category_id = categories.id
      `;
  
      const conditions: string[] = [];
      const params: any[] = [];
  
      // ✅ Apply search filter (searches in category name, user name, email, and expense description)
      if (filter.search) {
        conditions.push(`(categories.name LIKE ? OR users.name LIKE ? OR users.email LIKE ? OR expenses.description LIKE ?)`);
        params.push(`%${filter.search}%`, `%${filter.search}%`, `%${filter.search}%`, `%${filter.search}%`);
      }
  
      // ✅ Apply email filter separately (if provided)
      if (filter.email) {
        conditions.push(`users.email LIKE ?`);
        params.push(`%${filter.email}%`);
      }
  
      // ✅ Apply users filter (if provided)
      if (filter.users && filter.users.length > 0) {
        conditions.push(`expenses.user_id IN (${filter.users.map(() => "?").join(", ")})`);
        params.push(...filter.users);
      }
  
      // ✅ Apply category filter (if provided)
      if (filter.category && filter.category.length > 0) {
        conditions.push(`expenses.category_id IN (${filter.category.map(() => "?").join(", ")})`);
        params.push(...filter.category);
      }
  
      // ✅ Apply date range filter (if provided)
      if (filter.dateRange && filter.dateRange.length === 2) {
        conditions.push(`DATE(expenses.created_at) BETWEEN ? AND ?`);
        params.push(filter.dateRange[0], filter.dateRange[1]);
      }
  
      // ✅ Add WHERE clause if any conditions exist
      if (conditions.length > 0) {
        query += ` WHERE ` + conditions.join(" AND ");
      }
  
      query += ` ORDER BY expenses.id DESC`;
  
      // ✅ Execute query with parameters
      const [result] = await connection.execute(query, params);
      return result;
    } catch (error) {
      throw error;
    }
  }
  

  static async getExpenseById(id: number) {
    try {
      const connection = DB()
      const query = `SELECT expenses.*, users.name AS user_name, users.email, categories.name AS category_name 
        FROM expenses 
        JOIN users ON expenses.user_id = users.id 
        JOIN categories ON expenses.category_id = categories.id WHERE expenses.id =?`
      const [rows] = await connection.execute(query, [id])
      return Array.isArray(rows) ? rows[0] : null
    } catch (error) {
      throw error
    }
  }

  static async updateExpense(
    id: number,
    user_id: number,
    category_id: number,
    amount: number,
    date: Date,
    description: string
  ) {
    try {
      const connection = DB()
      const query = `UPDATE expenses SET user_id =?, category_id =?, amount =?, date =?, description =? WHERE id =?`
      const [result] = await connection.execute(query, [user_id, category_id, amount, date, description, id])
      return result
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  static async deleteExpense(id: number) {
    try {
      const connection = DB()
      const query = `DELETE FROM Expenses WHERE id =?`
      const [result] = await connection.execute(query, [id])
      return result
    } catch (error) {
      throw error
    }
  }
}
