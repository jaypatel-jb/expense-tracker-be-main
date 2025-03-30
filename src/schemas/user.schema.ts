import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  status: z.enum(["active", "inactive"]).default("active")
})

export const UpdateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  status: z.enum(["active", "inactive"])
})


export const ParamsSchema = z.object({
  id: z.string().nonempty()
})
export type UpdateUserType = z.TypeOf<typeof UpdateUserSchema>
export type UserRegisterType = z.TypeOf<typeof registerSchema>
