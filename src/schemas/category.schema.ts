import { z } from "zod"

export const CreateCategorySchema = z.object({
  name: z.string().min(2),
})



export const ParamsSchema = z.object({
  id: z.string().nonempty()
})

