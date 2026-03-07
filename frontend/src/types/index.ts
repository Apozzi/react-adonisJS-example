export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "viewer";
  password: string;
  createdAt: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  managerId: string | null;
  fixedCommission: number;
  percentCommission: number;
  active: boolean;
  createdAt: string;
}

export interface Sale {
  id: string;
  sellerId: string;
  vehicleModel: string;
  saleValue: number;
  saleDate: string;
  sellerCommission: number;
  managerCommission: number;
  sellerRule: string;
  managerRule: string;
}

export type Page = "dashboard" | "usuarios" | "vendedores" | "vendas" | "relatorios";
