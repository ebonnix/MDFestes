import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ServicePage from "./pages/ServicePage";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/admin"} component={Admin} />

      {/* Plowing & Excavation */}
      <Route path={"/snow-plowing-estes-park"} component={ServicePage} />
      <Route path={"/excavation-estes-park"} component={ServicePage} />
      <Route path={"/grading-land-prep-estes-park"} component={ServicePage} />
      <Route path={"/driveway-maintenance-estes-park"} component={ServicePage} />

      {/* General Construction */}
      <Route path={"/construction-estes-park"} component={ServicePage} />
      <Route path={"/garage-builder-estes-park"} component={ServicePage} />
      <Route path={"/home-additions-estes-park"} component={ServicePage} />
      <Route path={"/deck-builder-estes-park"} component={ServicePage} />
      <Route path={"/siding-contractor-estes-park"} component={ServicePage} />
      <Route path={"/home-renovation-estes-park"} component={ServicePage} />
      <Route path={"/deck-staining-estes-park"} component={ServicePage} />
      <Route path={"/fencing-contractor-estes-park"} component={ServicePage} />
      <Route path={"/machine-repair-estes-park"} component={ServicePage} />
      <Route path={"/flatwork-retaining-walls-estes-park"} component={ServicePage} />
      <Route path={"/foundation-contractor-estes-park"} component={ServicePage} />

      {/* Concrete */}
      <Route path={"/broom-finish-concrete-estes-park"} component={ServicePage} />
      <Route path={"/slick-trowel-concrete-estes-park"} component={ServicePage} />
      <Route path={"/stamped-concrete-estes-park"} component={ServicePage} />

      {/* Interior */}
      <Route path={"/drywall-contractor-estes-park"} component={ServicePage} />
      <Route path={"/framing-contractor-estes-park"} component={ServicePage} />
      <Route path={"/flooring-installation-estes-park"} component={ServicePage} />
      <Route path={"/trim-molding-estes-park"} component={ServicePage} />
      <Route path={"/window-installation-estes-park"} component={ServicePage} />
      <Route path={"/kitchen-remodel-estes-park"} component={ServicePage} />
      <Route path={"/basement-finishing-estes-park"} component={ServicePage} />

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
