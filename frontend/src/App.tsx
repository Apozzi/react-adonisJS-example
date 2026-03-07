import { AppProvider, useApp } from "./context/AppContext";
import Login from "./pages/Login/Login";
import Sidebar from "./components/Sidebar/Sidebar";
import Topbar from "./components/Topbar/Topbar";
import MainContent from "./components/MainContent/MainContent";
import Toast from "./components/Toast/Toast";

function Shell() {
  const { currentUser, toast, clearToast } = useApp();

  if (!currentUser) return <Login />;

  return (
    <div className="min-h-screen bg-[#080a0f] flex" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={clearToast} />}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <MainContent />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
