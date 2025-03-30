import { z } from "zod"

export const ExpensesSchema = z.object({
  user_id: z.string().nonempty(),
  category_id: z.string().nonempty(),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  date: z.coerce.date(),
  description: z.string().nonempty(),
});

export const ParamsSchema = z.object({
  id: z.string().nonempty()
})
export type ExpensesType = z.TypeOf<typeof ExpensesSchema>
