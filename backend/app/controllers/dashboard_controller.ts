import Sale from '#models/sale'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class DashboardController {
  /**
   * GET /dashboard
   * Returns all aggregated data for the dashboard in one request
   */
  async index({ }: HttpContext) {
    const sevenDaysAgo  = DateTime.now().minus({ days: 7 }).toISODate()!

    // ── Totals ──────────────────────────────────────────────────
    const totals = await db.from('sales').select(
      db.raw('COALESCE(SUM(sale_value), 0) as total_sales'),
      db.raw('COALESCE(SUM(seller_commission), 0) as total_seller_commission'),
      db.raw('COALESCE(SUM(manager_commission), 0) as total_manager_commission'),
      db.raw('COUNT(*) as total_count')
    ).first()

    // ── Active sellers count ─────────────────────────────────────
    const [{ count: activeSellers }] = await db.from('sellers').where('active', true).count('* as count')
    const [{ count: totalSellers }]  = await db.from('sellers').count('* as count')

    // ── Last 7 days bar chart ────────────────────────────────────
    const last7Raw = await db
      .from('sales')
      .where('sale_date', '>=', sevenDaysAgo)
      .select('sale_date')
      .sum('sale_value as total')
      .groupBy('sale_date')
      .orderBy('sale_date', 'asc')

    // Build full 7-day map (fill missing days with 0)
    const last7Map: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = DateTime.now().minus({ days: i }).toISODate()!
      last7Map[d] = 0
    }
    last7Raw.forEach((r: any) => {
      const key = r.sale_date instanceof Date
        ? r.sale_date.toISOString().split('T')[0]
        : String(r.sale_date).split('T')[0]
      last7Map[key] = Number(r.total)
    })
    const last7 = Object.entries(last7Map).map(([date, total]) => ({ date, total }))

    // ── Recent sales (last 10) ───────────────────────────────────
    const recentSales = await Sale.query()
      .preload('seller')
      .orderBy('sale_date', 'desc')
      .orderBy('id', 'desc')
      .limit(10)

    // ── Top sellers by commission ────────────────────────────────
    const topSellers = await db
      .from('sales')
      .join('sellers', 'sales.seller_id', 'sellers.id')
      .select('sellers.id', 'sellers.name')
      .sum('sales.seller_commission as total_commission')
      .sum('sales.sale_value as total_sales')
      .count('sales.id as sale_count')
      .groupBy('sellers.id', 'sellers.name')
      .orderBy('total_commission', 'desc')
      .limit(5)

    return {
      totals: {
        totalSales: Number(totals.total_sales),
        totalSellerCommission: Number(totals.total_seller_commission),
        totalManagerCommission: Number(totals.total_manager_commission),
        totalCount: Number(totals.total_count),
        activeSellers: Number(activeSellers),
        totalSellers: Number(totalSellers),
      },
      last7,
      recentSales: recentSales.map((s) => ({
        id: s.id,
        vehicleModel: s.vehicleModel,
        saleDate: s.saleDate,
        saleValue: Number(s.saleValue),
        sellerCommission: Number(s.sellerCommission),
        managerCommission: Number(s.managerCommission),
        seller: { id: s.seller.id, name: s.seller.name },
      })),
      topSellers: topSellers.map((s: any) => ({
        id: s.id,
        name: s.name,
        totalCommission: Number(s.total_commission),
        totalSales: Number(s.total_sales),
        saleCount: Number(s.sale_count),
      })),
    }
  }

  /**
   * GET /dashboard/report
   * Returns data for the charts on the Relatorio page
   * Supports ?sellerId=&from=YYYY-MM-DD&to=YYYY-MM-DD
   */
  async report({ request }: HttpContext) {
    const { sellerId, from, to } = request.qs()
    
    // Determine date range: if not provided, default to last 30 days
    const endDate = to || DateTime.now().toISODate()!
    const startDate = from || DateTime.now().minus({ days: 30 }).toISODate()!

    // ── Last 30 days line chart ──────────────────────────────────
    let last30Query = db
      .from('sales')
      .where('sale_date', '>=', startDate)
      .where('sale_date', '<=', endDate)
    if (sellerId) last30Query = last30Query.where('seller_id', sellerId)
    
    const last30Raw = await last30Query
      .select('sale_date')
      .sum('sale_value as total_sales')
      .sum({ total_commission: db.raw('seller_commission + manager_commission') })
      .groupBy('sale_date')
      .orderBy('sale_date', 'asc')

    const last30Map: Record<string, { totalSales: number; totalCommission: number }> = {}
    // Only fill days in the selected range
    let currentDate = DateTime.fromISO(startDate)
    const endDateDt = DateTime.fromISO(endDate)
    while (currentDate <= endDateDt) {
      const d = currentDate.toISODate()!
      last30Map[d] = { totalSales: 0, totalCommission: 0 }
      currentDate = currentDate.plus({ days: 1 })
    }
    last30Raw.forEach((r: any) => {
      const key = r.sale_date instanceof Date
        ? r.sale_date.toISOString().split('T')[0]
        : String(r.sale_date).split('T')[0]
      if (last30Map[key]) {
        last30Map[key].totalSales      = Number(r.total_sales)
        last30Map[key].totalCommission = Number(r.total_commission)
      }
    })
    const last30 = Object.entries(last30Map).map(([date, v]) => ({ date, ...v }))

    // ── Ranking per seller ───────────────────────────────────────
    let rankingQuery = db
      .from('sales')
      .join('sellers', 'sales.seller_id', 'sellers.id')
      .where('sales.sale_date', '>=', startDate)
      .where('sales.sale_date', '<=', endDate)
    if (sellerId) rankingQuery = rankingQuery.where('sales.seller_id', sellerId)
    
    const ranking = await rankingQuery
      .select('sellers.id', 'sellers.name', 'sellers.active')
      .sum('sales.seller_commission as total_commission')
      .sum('sales.sale_value as total_sales')
      .count('sales.id as sale_count')
      .groupBy('sellers.id', 'sellers.name', 'sellers.active')
      .orderBy('total_commission', 'desc')
      .limit(8)

    // ── Commission distribution ──────────────────────────────────
    let distQuery = db.from('sales')
      .where('sale_date', '>=', startDate)
      .where('sale_date', '<=', endDate)
    if (sellerId) distQuery = distQuery.where('seller_id', sellerId)
    
    const dist = await distQuery
      .select(
        db.raw('COALESCE(SUM(seller_commission), 0) as seller_total'),
        db.raw('COALESCE(SUM(manager_commission), 0) as manager_total'),
      ).first()

    return {
      last30,
      ranking: ranking.map((r: any) => ({
        id: r.id,
        name: r.name.split(' ')[0],
        active: Boolean(r.active),
        totalCommission: Number(r.total_commission),
        totalSales: Number(r.total_sales),
        saleCount: Number(r.sale_count),
      })),
      distribution: {
        sellerTotal: Number(dist.seller_total),
        managerTotal: Number(dist.manager_total),
      },
    }
  }
}
