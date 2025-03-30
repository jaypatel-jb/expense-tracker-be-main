import { DB } from "../database/db"

export class UserModel {
  static async createUser(name: string, email: string, status: string = "active") {
    try {
      const connection = DB()
      const query = `INSERT INTO users (name, email, status) VALUES (?, ?, ?)`
      const [result] = await connection.execute(query, [name, email, status])
      return result
    } catch (error) {
      console.log("error", error)
      throw error
    }
  }

  static async getAllUser(filters: { name?: string; email?: string; status?: 'active' | 'inactive' }={}) {
    try {
      const connection = DB();
      let query = `SELECT * FROM users WHERE 1=1`;
      const queryParams: any[] = [];
  
      // Filter by name (if provided)
      if (filters.name) {
        query += ` AND name LIKE ?`;
        queryParams.push(`%${filters.name}%`);
      }
  
      // Filter by email (if provided)
      if (filters.email) {
        query += ` AND email LIKE ?`;
        queryParams.push(`%${filters.email}%`);
      }
  
      // Filter by status (if provided, must be 'active' or 'inactive')
      if (filters.status) {
        query += ` AND status IN ('active', 'inactive') AND status = ?`;
        queryParams.push(filters.status);
      }
  
      const [result] = await connection.execute(query, queryParams);
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const connection = DB()
      const query = `SELECT * FROM users WHERE email = ?`
      const [rows] = await connection.execute(query, [email])
      return Array.isArray(rows) ? rows[0] : null
    } catch (error) {
      throw error
    }
  }

  static async getUserById(id: number) {
    try {
      const connection = DB()
      const query = `SELECT id, name, email, status, created_at FROM users WHERE id =?`
      const [rows] = await connection.execute(query, [id])
      return Array.isArray(rows) ? rows[0] : null
    } catch (error) {
      throw error
    }
  }

  static async updateUser(id: number, name: string, email: string, status: string) {
    try {
      const connection = DB()
      const query = `UPDATE users SET name =?,email=? ,status=? WHERE id =?`
      const [result] = await connection.execute(query, [name, email, status, id])
      return result
    } catch (error) {
      throw error
    }
  }

  static async deleteUser(id: number) {
    try {
      const connection = DB()
      const query = `DELETE FROM users WHERE id =?`
      const [result] = await connection.execute(query, [id])
      return result
    } catch (error) {
      throw error
    }
  }
}
