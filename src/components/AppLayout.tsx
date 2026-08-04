import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { label: "Home /Add Expense", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "All Expenses", to: "/purchases" },
];

const pageTitles: Record<string, string> = {
  "/": "Home / Add Purchase",
  "/dashboard": "Dashboard",
  "/purchases": "All Purchases",
};

export default function AppLayout() {
  const { logout, userEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-brand-900 px-4 py-5 text-white lg:sticky lg:top-0 lg:h-screen">
        <div className="mb-5 border-b border-white/15 px-3 pb-5 text-xl font-extrabold">
          Purchase Tracker
        </div>

        <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                [
                  "block whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-5 w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white lg:absolute lg:bottom-5 lg:left-4 lg:w-[228px]"
        >
          Logout
        </button>
      </aside>

      <main className="min-w-0">
        <header className="sticky top-0 z-10 flex h-18 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
          <h1 className="text-xl font-extrabold text-slate-900">
            {pageTitles[location.pathname] ?? "Purchase Tracker"}
          </h1>
          <span className="rounded-full bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700 sm:text-sm">
            {userEmail}
          </span>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
