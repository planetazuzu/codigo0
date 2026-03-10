import React, { useState, Suspense, lazy, useEffect } from 'react';
import { useRoutePrefetch } from './hooks/useRoutePrefetch';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
// React Query removido - no se estaba usando (solo QueryClient configurado sin useQuery/useMutation)
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import SearchModal from "@/components/layout/SearchModal";
import MenuSheet from "@/components/layout/MenuSheet";
import UpdateNotification from "@/components/layout/UpdateNotification";
import InstallBanner from "@/components/layout/InstallBanner";
import DisclaimerModal from "@/components/DisclaimerModal";
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoader from "@/components/ui/PageLoader";
import { featureFlags } from "@/config/featureFlags";
import ClinicalSuggestions from "@/components/ClinicalSuggestions";
import EmergencyModeRoot from "@/components/emergency/EmergencyModeRoot";

// Página principal - cargar inmediatamente (crítica)
import Home from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy loading de páginas de contenido (cargar bajo demanda)
const SoporteVital = lazy(() => import("./pages/SoporteVital"));
const Patologias = lazy(() => import("./pages/Patologias"));
const Escena = lazy(() => import("./pages/Escena"));
const Farmacos = lazy(() => import("./pages/Farmacos"));
const Herramientas = lazy(() => import("./pages/Herramientas"));
const Material = lazy(() => import("./pages/Material"));
const Telefono = lazy(() => import("./pages/Telefono"));
const Comunicacion = lazy(() => import("./pages/Comunicacion"));
const ManualIndex = lazy(() => import("./pages/ManualIndex"));
const ManualViewer = lazy(() => import("./pages/ManualViewer"));
const RCP = lazy(() => import("./pages/RCP"));
const Ictus = lazy(() => import("./pages/Ictus"));
const Shock = lazy(() => import("./pages/Shock"));
const ViaAerea = lazy(() => import("./pages/ViaAerea"));

// Lazy loading de páginas de utilidades
const Favoritos = lazy(() => import("./pages/Favoritos"));
const Historial = lazy(() => import("./pages/Historial"));
const Ajustes = lazy(() => import("./pages/Ajustes"));
const Acerca = lazy(() => import("./pages/Acerca"));
const GaleriaImagenes = lazy(() => import("./pages/GaleriaImagenes"));
const Privacidad = lazy(() => import("./pages/Privacidad"));
const DescargoResponsabilidad = lazy(() => import("./pages/DescargoResponsabilidad"));
const AvisoLegal = lazy(() => import("./pages/AvisoLegal"));
const Parto = lazy(() => import("./pages/Parto"));

// Lazy loading de Guías de Refuerzo (Modo Formativo)
const GuideIndex = lazy(() => import("./views/formativo/GuideIndex"));
const GuideViewer = lazy(() => import("./views/formativo/GuideViewer"));

// Lazy loading de Testing (solo desarrollo)
const TestingPage = lazy(() => import("./pages/TestingPage"));
const GuideSectionViewer = lazy(() => import("./views/formativo/GuideSectionViewer"));
import { GuideLayout } from "./layouts/GuideLayout";
const VitalsDashboard = lazy(() => import("./tools/vitals-dashboard/VitalsDashboard"));
const SepsisChecklist = lazy(() => import("./tools/checklists/sepsis/SepsisChecklist"));
const IctusChecklist = lazy(() => import("./tools/checklists/ictus/IctusChecklist"));
const ParadaChecklist = lazy(() => import("./tools/checklists/parada/ParadaChecklist"));
const PartoChecklist = lazy(() => import("./tools/checklists/parto/PartoChecklist"));
const AnafilaxiaChecklist = lazy(() => import("./tools/checklists/anafilaxia/AnafilaxiaChecklist"));
const IntoxicacionesChecklist = lazy(() => import("./tools/checklists/intoxicaciones/IntoxicacionesChecklist"));
const ConvulsionesChecklist = lazy(() => import("./tools/checklists/convulsiones/ConvulsionesChecklist"));
const TermicasChecklist = lazy(() => import("./tools/checklists/termicas/TermicasChecklist"));
const ShockSepticPathway = lazy(() => import("./tools/pathways/shock-septico/ShockSepticPathway"));
const BroselowQuick = lazy(() => import("./tools/pediatria-broselow/BroselowQuick"));
const Urgencias = lazy(() => import("./pages/Urgencias"));

const App = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Inicializar optimizaciones de preload
  useEffect(() => {
    import('./utils/preload').then(({ initPreloadOptimizations }) => {
      initPreloadOptimizations();
    });
  }, []);
  
  // Prefetch de rutas en hover
  useRoutePrefetch(true);

  return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>
              <div className="min-h-screen bg-background flex flex-col">
                <Header
                  onSearchClick={() => setIsSearchOpen(true)}
                  onMenuClick={() => setIsMenuOpen(true)}
                />

                <main className="pt-14 pb-safe flex-1">
                  <div className="container max-w-2xl md:max-w-3xl lg:max-w-7xl py-4">
                    {featureFlags.advancedTools && (
                      <div className="mb-4">
                        <ClinicalSuggestions />
                      </div>
                    )}
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route
                          path="/"
                          element={<Home onSearchClick={() => setIsSearchOpen(true)} />}
                        />
                        <Route path="/soporte-vital" element={<SoporteVital />} />
                        <Route path="/patologias" element={<Patologias />} />
                        <Route path="/escena" element={<Escena />} />
                        <Route path="/farmacos" element={<Farmacos />} />
                        <Route path="/herramientas" element={<Herramientas />} />
                        <Route path="/material" element={<Material />} />
                        <Route path="/telefono" element={<Telefono />} />
                        <Route path="/comunicacion" element={<Comunicacion />} />
                        <Route path="/manual" element={<ManualIndex />} />
                        <Route path="/manual/:parte/:bloque/:capitulo" element={<ManualViewer />} />
                        <Route path="/rcp" element={<RCP />} />
                        <Route path="/ictus" element={<Ictus />} />
                        <Route path="/shock" element={<Shock />} />
                        <Route path="/via-aerea" element={<ViaAerea />} />
                        <Route path="/urgencias" element={<Urgencias />} />
                        <Route path="/favoritos" element={<Favoritos />} />
                        <Route path="/historial" element={<Historial />} />
                        <Route path="/ajustes" element={<Ajustes />} />
                        <Route path="/acerca" element={<Acerca />} />
                        <Route path="/galeria" element={<GaleriaImagenes />} />
                        <Route path="/privacidad" element={<Privacidad />} />
                        <Route path="/descargo-responsabilidad" element={<DescargoResponsabilidad />} />
                        <Route path="/aviso-legal" element={<AvisoLegal />} />
                        <Route path="/parto" element={<Parto />} />
                        <Route path="/testing" element={<TestingPage />} />
                        {featureFlags.vitalsDashboard && (
                          <Route path="/advanced/vitals" element={<VitalsDashboard />} />
                        )}
                        {featureFlags.interactiveChecklists && (
                          <Route path="/checklists/sepsis" element={<SepsisChecklist />} />
                        )}
                        {featureFlags.interactiveChecklists && (
                          <Route path="/checklists/ictus" element={<IctusChecklist />} />
                        )}
                        {featureFlags.interactiveChecklists && (
                          <Route path="/checklists/parada" element={<ParadaChecklist />} />
                        )}
                        {featureFlags.interactiveChecklists && (
                          <Route path="/checklists/parto" element={<PartoChecklist />} />
                        )}
                        {featureFlags.interactiveChecklists && (
                          <Route path="/checklists/anafilaxia" element={<AnafilaxiaChecklist />} />
                        )}
                        {featureFlags.interactiveChecklists && (
                          <Route
                            path="/checklists/intoxicaciones"
                            element={<IntoxicacionesChecklist />}
                          />
                        )}
                        {featureFlags.interactiveChecklists && (
                          <Route
                            path="/checklists/convulsiones"
                            element={<ConvulsionesChecklist />}
                          />
                        )}
                        {featureFlags.interactiveChecklists && (
                          <Route path="/checklists/termicas" element={<TermicasChecklist />} />
                        )}
                        {featureFlags.pathways && (
                          <Route path="/pathways/shock-septico" element={<ShockSepticPathway />} />
                        )}
                        {featureFlags.advancedTools && (
                          <Route path="/advanced/broselow" element={<BroselowQuick />} />
                        )}
                        
                        {/* Rutas de Guías de Refuerzo (Modo Formativo) */}
                        <Route
                          path="/guia-refuerzo"
                          element={
                            <GuideLayout
                              onSearchClick={() => setIsSearchOpen(true)}
                              onMenuClick={() => setIsMenuOpen(true)}
                            >
                              <GuideIndex />
                            </GuideLayout>
                          }
                        />
                        <Route
                          path="/guia-refuerzo/:guia"
                          element={
                            <GuideLayout
                              onSearchClick={() => setIsSearchOpen(true)}
                              onMenuClick={() => setIsMenuOpen(true)}
                            >
                              <GuideViewer />
                            </GuideLayout>
                          }
                        />
                        <Route
                          path="/guia-refuerzo/:guia/seccion/:numero"
                          element={
                            <GuideLayout
                              onSearchClick={() => setIsSearchOpen(true)}
                              onMenuClick={() => setIsMenuOpen(true)}
                            >
                              <GuideSectionViewer />
                            </GuideLayout>
                          }
                        />
                        
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </div>
                </main>

                <BottomNav />

                <Footer />

                <UpdateNotification />
                <InstallBanner />

                <SearchModal
                  isOpen={isSearchOpen}
                  onClose={() => setIsSearchOpen(false)}
                />

                <MenuSheet
                  isOpen={isMenuOpen}
                  onClose={() => setIsMenuOpen(false)}
                />

                {/* Disclaimer legal - Primera carga */}
                <DisclaimerModal />

                {/* Módulo complementario y desacoplado: Modo Emergencia */}
                <EmergencyModeRoot />
              </div>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
  );
};

export default App;
