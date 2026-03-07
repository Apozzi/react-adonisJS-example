import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

export default class DatabaseSeeder extends BaseSeeder {
  async run() {
    const existingUsers = await db.from('users').count('* as total')
    if (Number(existingUsers[0].total) > 0) {
      console.log('✅ Database already seeded, skipping.')
      return
    }

    // ── 1. Users ────────────────────────────────────────────────
    const hashedPassword = await hash.make('password123')

    await db.table('users').multiInsert([
      {
        full_name: 'Admin Sistema',
        email: 'admin@comissoes.com',
        password: hashedPassword,
        created_at: DateTime.now().toISO(),
        updated_at: DateTime.now().toISO(),
      },
      {
        full_name: 'Carlos Mendes',
        email: 'carlos@comissoes.com',
        password: hashedPassword,
        created_at: DateTime.now().toISO(),
        updated_at: DateTime.now().toISO(),
      },
      {
        full_name: 'Fernanda Costa',
        email: 'fernanda@comissoes.com',
        password: hashedPassword,
        created_at: DateTime.now().toISO(),
        updated_at: DateTime.now().toISO(),
      },
    ])

    // ── 2. Sellers ───────────────────────────────────────────────
    // Gerentes first (managerId = null)
    await db.table('sellers').multiInsert([
      {
        name: 'Carlos Mendes',
        email: 'carlos.mendes@auto.com',
        manager_id: null,
        fixed_commission: 600.00,
        percent_commission: 1.50,
        active: true,
        created_at: DateTime.now().minus({ months: 12 }).toISO(),
        updated_at: DateTime.now().toISO(),
      },
      {
        name: 'Fernanda Costa',
        email: 'fernanda.costa@auto.com',
        manager_id: null,
        fixed_commission: 500.00,
        percent_commission: 1.20,
        active: true,
        created_at: DateTime.now().minus({ months: 10 }).toISO(),
        updated_at: DateTime.now().toISO(),
      },
    ])

    // Fetch manager IDs
    const [carlos, fernanda] = await db.from('sellers').orderBy('id', 'asc').limit(2)

    // Vendedores subordinados
    await db.table('sellers').multiInsert([
      {
        name: 'Ana Paula Souza',
        email: 'ana.paula@auto.com',
        manager_id: carlos.id,
        fixed_commission: 350.00,
        percent_commission: 1.00,
        active: true,
        created_at: DateTime.now().minus({ months: 8 }).toISO(),
        updated_at: DateTime.now().toISO(),
      },
      {
        name: 'Ricardo Lima',
        email: 'ricardo.lima@auto.com',
        manager_id: carlos.id,
        fixed_commission: 400.00,
        percent_commission: 1.10,
        active: true,
        created_at: DateTime.now().minus({ months: 7 }).toISO(),
        updated_at: DateTime.now().toISO(),
      },
      {
        name: 'Juliana Martins',
        email: 'juliana.martins@auto.com',
        manager_id: fernanda.id,
        fixed_commission: 300.00,
        percent_commission: 0.90,
        active: true,
        created_at: DateTime.now().minus({ months: 6 }).toISO(),
        updated_at: DateTime.now().toISO(),
      },
      {
        name: 'Bruno Alves',
        email: 'bruno.alves@auto.com',
        manager_id: fernanda.id,
        fixed_commission: 300.00,
        percent_commission: 0.80,
        active: true,
        created_at: DateTime.now().minus({ months: 5 }).toISO(),
        updated_at: DateTime.now().toISO(),
      },
      {
        name: 'Patrícia Nunes',
        email: 'patricia.nunes@auto.com',
        manager_id: carlos.id,
        fixed_commission: 0.00,
        percent_commission: 2.00,
        active: false, // inactive seller to test UI
        created_at: DateTime.now().minus({ months: 4 }).toISO(),
        updated_at: DateTime.now().toISO(),
      },
    ])

    // ── 3. Sales (last 35 days, realistic data) ─────────────────
    const allSellers = await db.from('sellers').where('active', true).orderBy('id', 'asc')

    const vehicles = [
      { model: 'Onix 2024', basePrice: 82_000 },
      { model: 'HB20 2024', basePrice: 78_000 },
      { model: 'Polo 2024', basePrice: 105_000 },
      { model: 'Argo 2024', basePrice: 88_000 },
      { model: 'Cronos 2024', basePrice: 92_000 },
      { model: 'Civic 2024', basePrice: 165_000 },
      { model: 'Corolla 2024', basePrice: 158_000 },
      { model: 'Tracker 2024', basePrice: 132_000 },
      { model: 'Pulse 2024', basePrice: 115_000 },
      { model: 'T-Cross 2024', basePrice: 128_000 },
      { model: 'Compass 2024', basePrice: 195_000 },
      { model: 'HR-V 2024', basePrice: 175_000 },
    ]

    const salesToInsert: object[] = []

    // Generate ~4-6 sales per day for last 35 days
    for (let daysAgo = 35; daysAgo >= 0; daysAgo--) {
      const saleDate = DateTime.now().minus({ days: daysAgo }).toISODate()!
      const dayOfWeek = DateTime.now().minus({ days: daysAgo }).weekday
      const count = dayOfWeek >= 6 ? rand(1, 2) : rand(3, 6)

      for (let i = 0; i < count; i++) {
        const seller = allSellers[Math.floor(Math.random() * allSellers.length)]
        const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)]

        const saleValue = Math.round(vehicle.basePrice * (0.90 + Math.random() * 0.20))

        const manager = seller.manager_id
          ? allSellers.find((s: any) => s.id === seller.manager_id)
          : null

        const sellerFixed = Number(seller.fixed_commission)
        const sellerPercent = saleValue * (Number(seller.percent_commission) / 100)
        const sellerTotal = sellerFixed + sellerPercent

        const managerFixed = manager ? Number(manager.fixed_commission) : 0
        const managerPercent = manager ? saleValue * (Number(manager.percent_commission) / 100) : 0
        const managerTotal = managerFixed + managerPercent

        const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        const buildRule = (total: number, fixed: number, percent: number, pct: number) => {
          if (total <= 0) return 'Sem comissão'
          const parts: string[] = []
          if (fixed > 0) parts.push(`${fmt(fixed)} fixo`)
          if (percent > 0) parts.push(`${pct}% = ${fmt(percent)}`)
          return `Total: ${fmt(total)} (${parts.join(' + ')})`
        }

        salesToInsert.push({
          seller_id: seller.id,
          vehicle_model: vehicle.model,
          sale_value: saleValue,
          sale_date: saleDate,
          seller_commission: sellerTotal,
          manager_commission: managerTotal,
          seller_rule: buildRule(sellerTotal, sellerFixed, sellerPercent, Number(seller.percent_commission)),
          manager_rule: managerTotal > 0 && manager
            ? buildRule(managerTotal, managerFixed, managerPercent, Number(manager.percent_commission))
            : 'Sem comissão',
          created_at: DateTime.now().minus({ days: daysAgo }).toISO(),
          updated_at: DateTime.now().minus({ days: daysAgo }).toISO(),
        })
      }
    }

    const chunkSize = 50
    for (let i = 0; i < salesToInsert.length; i += chunkSize) {
      await db.table('sales').multiInsert(salesToInsert.slice(i, i + chunkSize))
    }

    console.log(`✅ Seeded: 3 users, ${allSellers.length + 2} sellers, ${salesToInsert.length} sales`)
  }
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}