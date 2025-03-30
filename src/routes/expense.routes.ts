import { RequestHandler, Router } from "express"
import expensesController from "../controllers/expense.controller"
import { validateWithZod } from "../middlewares/validateWithZod"
import { ExpensesSchema, ParamsSchema } from "../schemas/expense.schema"


const router = Router()


router.post("/", validateWithZod({ body: ExpensesSchema }), expensesController.createExpense as RequestHandler)
router.get("/", expensesController.getExpenses)
router.put("/:id", validateWithZod({ body: ExpensesSchema, params: ParamsSchema }), expensesController.updateExpense)
router.delete("/:id", validateWithZod({ params: ParamsSchema }), expensesController.deleteExpense)
router.get("/:id", validateWithZod({ params: ParamsSchema }), expensesController.getExpense)
export default router
