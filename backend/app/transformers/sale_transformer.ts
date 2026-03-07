import type Sale from '#models/sale'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class SaleTransformer extends BaseTransformer<Sale> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'sellerId',
      'vehicleModel',
      'saleValue',
      'saleDate',
      'sellerCommission',
      'managerCommission',
      'sellerRule',
      'managerRule',
      'createdAt',
      'updatedAt',
    ])
  }
}
