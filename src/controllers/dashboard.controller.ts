import { NextFunction, Request, Response } from "express"
import { DB } from "../database/db"

const Statistics1 = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const query =
    "WITH RankedExpenses AS ( SELECT e.user_id, u.name AS user_name, e.date, SUM(e.amount) AS total_spent, ROW_NUMBER() OVER (PARTITION BY e.user_id ORDER BY SUM(e.amount) DESC) AS `rank` FROM expenses e JOIN users u ON e.user_id = u.id GROUP BY e.user_id, e.date ) SELECT user_id, user_name, date, total_spent FROM RankedExpenses WHERE `rank` <= 3 ORDER BY user_id, total_spent DESC;"

    try {
        const connection = DB()
        const [rows] = await connection.execute(query)
    
        return res.json({
            status:"success",
            message:"Statstics Get Successfully",
            data:rows
        })
      } catch (error) {
        next(error)
      }
}

const Statistics2 = async (req: Request, res: Response, next: NextFunction):Promise<any> =>{
  const query =
    "WITH MonthlyExpenses AS ( SELECT e.user_id, u.name AS user_name, DATE_FORMAT(e.date, '%Y-%m') AS month, SUM(e.amount) AS total_spent FROM expenses e JOIN users u ON e.user_id = u.id GROUP BY e.user_id, u.name, DATE_FORMAT(e.date, '%Y-%m') ), ExpenseChanges AS ( SELECT me.user_id, me.user_name, me.month, me.total_spent, LAG(me.total_spent) OVER (PARTITION BY me.user_id ORDER BY me.month) AS previous_month_spent, CASE WHEN LAG(me.total_spent) OVER (PARTITION BY me.user_id ORDER BY me.month) IS NOT NULL THEN ROUND(((me.total_spent - LAG(me.total_spent) OVER (PARTITION BY me.user_id ORDER BY me.month)) / LAG(me.total_spent) OVER (PARTITION BY me.user_id ORDER BY me.month)) * 100, 2) ELSE NULL END AS percentage_change FROM MonthlyExpenses me ) SELECT * FROM ExpenseChanges ORDER BY user_id, month;"
    try {
        const connection = DB()
        const [rows] = await connection.execute(query)
    
        return res.json({
            status:"success",
            message:"Statstics Get Successfully",
            data:rows
        })
      } catch (error) {
        next(error)
      }

}

const Statistics3 = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  const query = `
            WITH MonthlyExpenses AS (
                SELECT 
                    e.user_id,
                    u.name AS user_name,
                    DATE_FORMAT(e.date, '%Y-%m') AS month,
                    SUM(e.amount) AS total_spent
                FROM expenses e
                JOIN users u ON e.user_id = u.id
                GROUP BY e.user_id, u.name, DATE_FORMAT(e.date, '%Y-%m')
            ),
            AveragedSpending AS (
                SELECT 
                    me.user_id, 
                    me.user_name,
                    me.month, 
                    me.total_spent,
                    ROUND(AVG(me.total_spent) OVER (
                        PARTITION BY me.user_id 
                        ORDER BY STR_TO_DATE(me.month, '%Y-%m') 
                        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
                    ), 2) AS avg_last_3_months
                FROM MonthlyExpenses me
            ),
            RankedMonths AS (
                SELECT 
                    user_id, 
                    user_name, 
                    month,
                    total_spent,
                    avg_last_3_months,
                    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY STR_TO_DATE(month, '%Y-%m') DESC) AS ranked_row
                FROM AveragedSpending
            )
            SELECT 
                user_id, 
                user_name, 
                month AS last_recorded_month,
                total_spent AS last_month_spending,
                avg_last_3_months AS last_3_months_average,
                DATE_FORMAT(DATE_ADD(STR_TO_DATE(CONCAT(month, '-01'), '%Y-%m-%d'), INTERVAL 1 MONTH), '%Y-%m') AS predicted_month,
                IFNULL(avg_last_3_months, 0) AS predicted_spending  -- If no previous data, default to 0
            FROM RankedMonths
            WHERE ranked_row = 1
            ORDER BY user_id;
        `

  try {
    const connection = DB()
    const [rows] = await connection.execute(query)

    return res.json({
        status:"success",
        message:"Statstics Get Successfully",
        data:rows
    })
  } catch (error) {
    next(error)
  }
}

export default { Statistics2, Statistics3, Statistics1 }
