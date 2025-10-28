import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Briefcase, FileText, GraduationCap, Settings } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Rekomendasi Pelatihan", icon: Home },
    { path: "/settings", label: "Pengaturan & Data Master", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-primary shadow-md">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">SIAP-AI</h1>
              <p className="text-xs text-primary-foreground/80">Sistem Informasi Arahan Pelatihan</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary-foreground text-primary shadow-sm"
                      : "text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
