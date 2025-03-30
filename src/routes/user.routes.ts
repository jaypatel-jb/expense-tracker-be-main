import { RequestHandler, Router } from "express"
import userController from "../controllers/user.controller"
import { validateWithZod } from "../middlewares/validateWithZod"
import { ParamsSchema, registerSchema, UpdateUserSchema } from "../schemas/user.schema"
const router = Router()
router.post("/", validateWithZod({ body: registerSchema }), userController.createUser as RequestHandler)
router.get("/", userController.getUsers)
router.put("/:id", validateWithZod({ body: UpdateUserSchema, params: ParamsSchema }), userController.updateUser)
router.delete("/:id", validateWithZod({ params: ParamsSchema }), userController.deleteUser)
router.get("/:id", validateWithZod({ params: ParamsSchema }), userController.getUser)
export default router
