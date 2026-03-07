import vine from '@vinejs/vine'

export const createSaleValidator = vine.compile(
  vine.object({
    sellerId: vine.number(),
    vehicleModel: vine.string().minLength(2).maxLength(120),
    saleValue: vine.number().min(0.01),
    saleDate: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
)
