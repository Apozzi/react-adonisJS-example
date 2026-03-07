import type Seller from '#models/seller'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class SellerTransformer extends BaseTransformer<Seller> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'email',
      'managerId',
      'fixedCommission',
      'percentCommission',
      'active',
      'createdAt',
      'updatedAt',
    ])
  }
}
