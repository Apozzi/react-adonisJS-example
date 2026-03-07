import vine from '@vinejs/vine'

export const createSellerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(120),
    email: vine.string().email().maxLength(254),
    managerId: vine.number().optional().nullable(),
    fixedCommission: vine.number().min(0),
    percentCommission: vine.number().min(0).max(100),
    active: vine.boolean().optional(),
  })
)

export const updateSellerValidator = vine.compile(
  vine.object({
    name: vine.string().minLength(2).maxLength(120).optional(),
    email: vine.string().email().maxLength(254).optional(),
    managerId: vine.number().optional().nullable(),
    fixedCommission: vine.number().min(0).optional(),
    percentCommission: vine.number().min(0).max(100).optional(),
    active: vine.boolean().optional(),
  })
)
