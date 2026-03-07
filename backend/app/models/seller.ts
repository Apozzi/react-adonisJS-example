import { SellerSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Sale from './sale.js'

export default class Seller extends SellerSchema {
  @belongsTo(() => Seller, { foreignKey: 'managerId' })
  declare manager: BelongsTo<typeof Seller>

  @hasMany(() => Seller, { foreignKey: 'managerId' })
  declare subordinates: HasMany<typeof Seller>

  @hasMany(() => Sale)
  declare sales: HasMany<typeof Sale>
}
