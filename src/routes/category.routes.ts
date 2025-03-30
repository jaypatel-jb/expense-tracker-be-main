import { RequestHandler, Router } from "express"
import CategoryController from "../controllers/category.controller"
import { validateWithZod } from "../middlewares/validateWithZod"
import { CreateCategorySchema, ParamsSchema } from "../schemas/category.schema"


const router = Router()


router.post("/", validateWithZod({ body: CreateCategorySchema }), CategoryController.createCategory as RequestHandler)
router.get("/", CategoryController.getCategorys)
router.put("/:id", validateWithZod({ body: CreateCategorySchema, params: ParamsSchema }), CategoryController.updateCategory)
router.delete("/:id", validateWithZod({ params: ParamsSchema }), CategoryController.deleteCategory)
router.get("/:id", validateWithZod({ params: ParamsSchema }), CategoryController.getCategory)


export default router
