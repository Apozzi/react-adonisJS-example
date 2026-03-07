import { useApp } from "../../context/AppContext";
import Dashboard from "../../pages/Dashboard/Dashboard";
import Usuarios from "../../pages/Usuarios/Usuarios";
import Vendedores from "../../pages/Vendedores/Vendedores";
import Vendas from "../../pages/Vendas/Vendas";
import Relatorio from "../../pages/Relatorio/Relatorio";

export default function MainContent() {
  const { page } = useApp();

  return (
    <main className="flex-1 overflow-y-auto">
      {page === "dashboard"  && <Dashboard  />}
      {page === "usuarios"   && <Usuarios   />}
      {page === "vendedores" && <Vendedores />}
      {page === "vendas"     && <Vendas     />}
      {page === "relatorios" && <Relatorio  />}
    </main>
  );
}
