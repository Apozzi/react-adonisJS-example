import { User, Seller, Sale } from "../types";
import { calcCommissions } from "../utils/commission";

export const SEED_USERS: User[] = [
  {
    id: "u1",
    name: "Admin Sistema",
    email: "admin@comissoes.com",
    role: "admin",
    password: "admin123",
    createdAt: "2024-01-01",
  },
  {
    id: "u2",
    name: "Visualizador",
    email: "viewer@comissoes.com",
    role: "viewer",
    password: "viewer123",
    createdAt: "2024-01-15",
  },
];

export const SEED_SELLERS: Seller[] = [
  {
    id: "s1",
    name: "Carlos Mendes",
    email: "carlos@auto.com",
    managerId: null,
    fixedCommission: 500,
    percentCommission: 1.5,
    active: true,
    createdAt: "2024-01-10",
  },
  {
    id: "s2",
    name: "Ana Paula",
    email: "ana@auto.com",
    managerId: "s1",
    fixedCommission: 350,
    percentCommission: 1.2,
    active: true,
    createdAt: "2024-02-01",
  },
  {
    id: "s3",
    name: "Ricardo Lima",
    email: "ricardo@auto.com",
    managerId: "s1",
    fixedCommission: 400,
    percentCommission: 1.0,
    active: true,
    createdAt: "2024-02-15",
  },
  {
    id: "s4",
    name: "Fernanda Costa",
    email: "fernanda@auto.com",
    managerId: null,
    fixedCommission: 0,
    percentCommission: 2.0,
    active: false,
    createdAt: "2024-03-01",
  },
];

export function generateSales(sellers: Seller[]): Sale[] {
  const models = [
    "Civic 2024", "Corolla 2024", "HB20 2024", "Onix 2024",
    "Tracker 2024", "Pulse 2024", "Argo 2024", "Cronos 2024",
  ];
  const sales: Sale[] = [];
  let idCounter = 1;
  const now = new Date();
  const activeSellers = sellers.filter((s) => s.active);

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const count = Math.floor(Math.random() * 4) + 1;

    for (let j = 0; j < count; j++) {
      const seller = activeSellers[Math.floor(Math.random() * activeSellers.length)];
      if (!seller) continue;

      const saleValue = Math.floor(Math.random() * 80000) + 40000;
      const { sellerCommission, managerCommission, sellerRule, managerRule } =
        calcCommissions(saleValue, seller, sellers);

      sales.push({
        id: `sale${idCounter++}`,
        sellerId: seller.id,
        vehicleModel: models[Math.floor(Math.random() * models.length)],
        saleValue,
        saleDate: date.toISOString().split("T")[0],
        sellerCommission,
        managerCommission,
        sellerRule,
        managerRule,
      });
    }
  }
  return sales;
}
