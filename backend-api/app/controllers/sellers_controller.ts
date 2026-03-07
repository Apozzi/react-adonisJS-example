import Seller from '#models/seller'
import { createSellerValidator, updateSellerValidator } from '#validators/seller'
import type { HttpContext } from '@adonisjs/core/http'

export default class SellersController {
  /**
   * GET /sellers
   * List all sellers, optionally filtered by active status
   */
  async index({ request }: HttpContext) {
    const { active } = request.qs()

    const query = Seller.query().orderBy('name', 'asc')

    if (active !== undefined) {
      query.where('active', active === 'true' || active === '1')
    }

    return await query
  }

  /**
   * POST /sellers
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createSellerValidator)

    // Validate manager exists if provided
    if (data.managerId) {
      const manager = await Seller.find(data.managerId)
      if (!manager) {
        return response.unprocessableEntity({ errors: [{ message: 'Manager not found' }] })
      }
    }

    const seller = await Seller.create({
      name: data.name,
      email: data.email,
      managerId: data.managerId ?? null,
      fixedCommission: String(data.fixedCommission),
      percentCommission: String(data.percentCommission),
      active: data.active ?? true,
    })

    return response.created(seller)
  }

  /**
   * GET /sellers/:id
   */
  async show({ params, response }: HttpContext) {
    const seller = await Seller.find(Number(params.id))

    if (!seller) {
      return response.notFound({ message: 'Seller not found' })
    }

    return seller
  }

  /**
   * PUT /sellers/:id
   */
  async update({ params, request, response }: HttpContext) {
    const seller = await Seller.find(Number(params.id))

    if (!seller) {
      return response.notFound({ message: 'Seller not found' })
    }

    const data = await request.validateUsing(updateSellerValidator)

    if (data.managerId !== undefined) {
      if (data.managerId === Number(seller.id)) {
        return response.unprocessableEntity({ errors: [{ message: 'Seller cannot be their own manager' }] })
      }
      if (data.managerId) {
        const manager = await Seller.find(data.managerId)
        if (!manager) {
          return response.unprocessableEntity({ errors: [{ message: 'Manager not found' }] })
        }
      }
    }

    const mergeData = {
      ...data,
      fixedCommission: data.fixedCommission !== undefined ? String(data.fixedCommission) : undefined,
      percentCommission: data.percentCommission !== undefined ? String(data.percentCommission) : undefined,
    }
    seller.merge(mergeData as Partial<Seller>)
    await seller.save()

    return seller
  }

  /**
   * DELETE /sellers/:id
   */
  async destroy({ params, response }: HttpContext) {
    const seller = await Seller.find(Number(params.id))

    if (!seller) {
      return response.notFound({ message: 'Seller not found' })
    }

    await seller.delete()

    return response.noContent()
  }
}
