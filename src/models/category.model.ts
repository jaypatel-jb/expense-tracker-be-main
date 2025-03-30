import { DB } from "../database/db"

export class CategoryModel {
  static async createCategory(name: string) {
    try {
      const connection = DB()
      const query = `INSERT INTO categories (name) VALUES (?)`
      const [result] = await connection.execute(query, [name])
      return result
    } catch (error) {
      throw error
    }
  }
  static async getAllCategory(filters: { name?: string } = {}) {
    try {
      const connection = DB();
      let query = `SELECT * FROM categories`;
      const queryParams: any[] = [];
  
      // Filter by name (if provided)
      if (filters.name) {
        query += ` WHERE name LIKE ?`;
        queryParams.push(`%${filters.name}%`);
      }
  
      const [result] = await connection.execute(query, queryParams);
      return result;
    } catch (error) {
      throw error;
    }
  }
  

  static async getCategoryByName(name: string) {
    try {
      const connection = DB()
      const query = `SELECT * FROM categories WHERE name = ?`
      const [rows] = await connection.execute(query, [name])
      return Array.isArray(rows) ? rows[0] : null
    } catch (error) {
      throw error
    }
  }

  static async getCategoryById(id: number) {
    try {
      const connection = DB()
      const query = `SELECT * FROM categories WHERE id =?`
      const [rows] = await connection.execute(query, [id])
      return Array.isArray(rows) ? rows[0] : null
    } catch (error) {
      throw error
    }
  }

  static async updateCategory(id: number, name: string) {
    try {
      const connection = DB()
      const query = `UPDATE categories SET name =? WHERE id =?`
      const [result] = await connection.execute(query, [name, id])
      return result
    } catch (error) {
      throw error
    }
  }

  static async deleteCategory(id: number) {
    try {
      const connection = DB()
      const query = `DELETE FROM categories WHERE id =?`
      const [result] = await connection.execute(query, [id])
      return result
    } catch (error) {
      throw error
    }
  }
}
