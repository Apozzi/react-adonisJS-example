import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sellers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('email', 254).notNullable().unique()
      table
        .integer('manager_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('sellers')
        .onDelete('SET NULL')
      table.decimal('fixed_commission', 10, 2).notNullable().defaultTo(0)
      table.decimal('percent_commission', 5, 2).notNullable().defaultTo(0)
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
