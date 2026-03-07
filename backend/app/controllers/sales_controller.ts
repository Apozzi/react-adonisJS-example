import Sale from '#models/sale'
import Seller from '#models/seller'
import { createSaleValidator } from '#validators/sale'
import type { HttpContext } from '@adonisjs/core/http'
import { calcCommissions } from '#services/commission_service'
import { DateTime } from 'luxon'

export default class SalesController {
  /**
   * GET /sales
   * Supports ?sellerId=&from=YYYY-MM-DD&to=YYYY-MM-DD&limit=
   */
  async index({ request }: HttpContext) {
    const { sellerId, from, to, limit } = request.qs()

    const query = Sale.query()
      .preload('seller')
      .orderBy('sale_date', 'desc')
      .orderBy('id', 'desc')

    if (sellerId) query.where('seller_id', sellerId)
    if (from) query.where('sale_date', '>=', from)
    if (to) query.where('sale_date', '<=', to)
    if (limit) query.limit(Number(limit))

    return await query
  }

  /**
   * POST /sales
   * Automatically calculates commissions before saving
   */
  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createSaleValidator)

    const seller = await Seller.find(data.sellerId)
    if (!seller) {
      return response.unprocessableEntity({ errors: [{ message: 'Seller not found' }] })
    }
    if (!seller.active) {
      return response.unprocessableEntity({ errors: [{ message: 'Seller is inactive' }] })
    }

    const { sellerCommission, managerCommission, sellerRule, managerRule } =
      await calcCommissions(data.saleValue, seller)

    const sale = await Sale.create({
      sellerId: data.sellerId,
      vehicleModel: data.vehicleModel,
      saleValue: String(data.saleValue),
      saleDate: DateTime.fromISO(data.saleDate),
      sellerCommission: String(sellerCommission),
      managerCommission: String(managerCommission),
      sellerRule: String(sellerRule),
      managerRule: String(managerRule),
    })

    return response.created(sale)
  }

  /**
   * GET /sales/:id
   */
  async show({ params, response }: HttpContext) {
    const sale = await Sale.query().where('id', params.id).preload('seller').first()

    if (!sale) {
      return response.notFound({ message: 'Sale not found' })
    }

    return sale
  }

  /**
   * DELETE /sales/:id
   */
  async destroy({ params, response }: HttpContext) {
    const sale = await Sale.find(params.id)

    if (!sale) {
      return response.notFound({ message: 'Sale not found' })
    }

    await sale.delete()

    return response.noContent()
  }

  /**
   * GET /sales/commission-preview
   * Preview commissions before registering a sale
   */
  async commissionPreview({ request, response }: HttpContext) {
    const { sellerId, saleValue } = request.qs()

    if (!sellerId || !saleValue) {
      return response.badRequest({ message: 'sellerId and saleValue are required' })
    }

    const seller = await Seller.find(sellerId)
    if (!seller) {
      return response.notFound({ message: 'Seller not found' })
    }

    const result = await calcCommissions(Number(saleValue), seller)

    return result
  }
}
