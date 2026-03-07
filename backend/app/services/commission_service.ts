import Seller from '#models/seller'

export interface CommissionResult {
  sellerCommission: number
  managerCommission: number
  sellerRule: string
  managerRule: string
}

/**
 * Calculates commissions for a sale.
 * Seller gets: fixedCommission + (saleValue * percentCommission / 100)
 * Manager gets the same formula applied to their own rates.
 */
export async function calcCommissions(
  saleValue: number,
  seller: Seller
): Promise<CommissionResult> {
  let manager: Seller | null = null
  if (seller.managerId) {
    manager = await Seller.find(seller.managerId)
  }

  const fmt = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // Calculo comissão vendedor
  const sellerFixed = Number(seller.fixedCommission)
  const sellerPercent = saleValue * (Number(seller.percentCommission) / 100)
  const sellerTotal = sellerFixed + sellerPercent

  // Calculo comissão gerente
  const managerFixed = manager ? Number(manager.fixedCommission) : 0
  const managerPercent = manager ? saleValue * (Number(manager.percentCommission) / 100) : 0
  const managerTotal = managerFixed + managerPercent

  const buildRule = (total: number, fixed: number, percent: number, pct: number): string => {
    if (total <= 0) return 'Sem comissão'
    const parts: string[] = []
    if (fixed > 0) parts.push(`${fmt(fixed)} fixo`)
    if (percent > 0) parts.push(`${pct}% = ${fmt(percent)}`)
    return `Total: ${fmt(total)} (${parts.join(' + ')})`
  }

  return {
    sellerCommission: sellerTotal,
    managerCommission: managerTotal,
    sellerRule: buildRule(sellerTotal, sellerFixed, sellerPercent, Number(seller.percentCommission)),
    managerRule:
      managerTotal > 0 && manager
        ? buildRule(managerTotal, managerFixed, managerPercent, Number(manager.percentCommission))
        : 'Sem comissão',
  }
}
