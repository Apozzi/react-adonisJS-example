import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sales'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('seller_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('sellers')
        .onDelete('RESTRICT')
      table.string('vehicle_model').notNullable()
      table.decimal('sale_value', 12, 2).notNullable()
      table.date('sale_date').notNullable()

      table.decimal('seller_commission', 10, 2).notNullable().defaultTo(0)
      table.decimal('manager_commission', 10, 2).notNullable().defaultTo(0)
      table.string('seller_rule').nullable()
      table.string('manager_rule').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
