// fine-tuning-app-frontend/src/App.tsx
import { Routes, Route, Link as RouterLink, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from 'sonner';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Page Imports
import ModelsListPageShadcn from './pages/ModelsListPage.shadcn';
import DatasetsListPageShadcn from './pages/DatasetsListPage.shadcn';
import SettingsPage from "./pages/SettingsPage";
import ModelUploadFormShadcn from './components/ModelUploadForm.shadcn';
import CreateFineTuningJobPage_Shadcn from "./pages/CreateFineTuningJobPage.shadcn";
import FineTuningJobsListPage from "./pages/FineTuningJobsListPage";

// Icon Imports
import { Menu, Bot, Database, ListChecks, Settings } from 'lucide-react';

const navItems = [
  { href: '/models', icon: Bot, label: 'Modèles' },
  { href: '/datasets', icon: Database, label: 'Datasets' },
  { href: '/fine-tuning-jobs', icon: ListChecks, label: 'Jobs' },
];

function App() {
  const [modelsKey, setModelsKey] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const handleModelUploadSuccess = () => {
    setModelsKey(prevKey => prevKey + 1);
  };

  const MobileNav = () => (
    <div className={cn(
      "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
      { 'hidden': !mobileOpen }
    )}>
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <RouterLink to="/" className="flex items-center space-x-2">
          <Bot className="h-6 w-6" />
          <span className="font-bold">FineTuner</span>
        </RouterLink>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {navItems.map((item) => (
            <RouterLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                location.pathname.startsWith(item.href) ? "font-bold" : "text-muted-foreground"
              )}
            >
              {item.label}
            </RouterLink>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Toaster richColors theme="dark" />
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <RouterLink to="/" className="mr-6 flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">FineTuner</span>
            </RouterLink>
            <nav className="flex items-center gap-6 text-sm">
              {navItems.map(item => (
                <RouterLink
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    location.pathname.startsWith(item.href) ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {item.label}
                </RouterLink>
              ))}
            </nav>
          </div>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={handleDrawerToggle}
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center">
              <RouterLink to="/settings">
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </RouterLink>
            </nav>
          </div>
        </div>
      </header>
      <MobileNav />
      <main className="flex-1 p-4 md:p-8">
        <div className="container max-w-screen-2xl">
          <Routes>
            <Route path="/" element={<Navigate to="/fine-tuning-jobs" replace />} />
            <Route path="/models" element={<ModelsListPageShadcn key={modelsKey} />} />
            <Route path="/datasets" element={<DatasetsListPageShadcn />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/models/upload" element={<ModelUploadFormShadcn onUploadSuccess={handleModelUploadSuccess} />} />
            <Route path="/fine-tuning-jobs/create" element={<CreateFineTuningJobPage_Shadcn />} />
            <Route path="/fine-tuning-jobs" element={<FineTuningJobsListPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;

