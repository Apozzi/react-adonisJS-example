import { Seller } from "../types";
import { fmt } from "./format";

export function calcCommissions(
  saleValue: number,
  seller: Seller,
  sellers: Seller[]
) {
  const manager = sellers.find((s) => s.id === seller.managerId);

  const sellerFixed = seller.fixedCommission;
  const sellerPercent = saleValue * (seller.percentCommission / 100);
  const sellerTotal = sellerFixed + sellerPercent;

  const managerFixed = manager ? manager.fixedCommission : 0;
  const managerPercent = manager
    ? saleValue * (manager.percentCommission / 100)
    : 0;
  const managerTotal = managerFixed + managerPercent;

  const buildRule = (
    total: number,
    fixed: number,
    percent: number,
    pct: number
  ) =>
    total > 0
      ? `Total: ${fmt(total)} (${fixed > 0 ? `${fmt(fixed)} fixo` : ""}${
          percent > 0 ? ` + ${pct}% = ${fmt(percent)}` : ""
        })`
      : "Sem comissão";

  return {
    sellerCommission: sellerTotal,
    managerCommission: managerTotal,
    sellerRule: buildRule(
      sellerTotal,
      sellerFixed,
      sellerPercent,
      seller.percentCommission
    ),
    managerRule:
      managerTotal > 0 && manager
        ? buildRule(
            managerTotal,
            managerFixed,
            managerPercent,
            manager.percentCommission
          )
        : "Sem comissão",
  };
}
