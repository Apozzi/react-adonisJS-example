import { SaleSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Seller from '#models/seller'

export default class Sale extends SaleSchema {
  @belongsTo(() => Seller)
  declare seller: BelongsTo<typeof Seller>
}
