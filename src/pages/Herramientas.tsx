import { useState } from 'react';
import { Calculator, Table, AlertCircle, BookOpen } from 'lucide-react';
import GlasgowCalculator from '@/components/interactive/tools/GlasgowCalculator';
import ParklandCalculator from '@/components/interactive/tools/ParklandCalculator';
import PediatricDoseCalculator from '@/components/interactive/tools/PediatricDoseCalculator';
import RCPTimer from '@/components/interactive/tools/RCPTimer';
import OxygenDurationCalculator from '@/components/interactive/tools/OxygenDurationCalculator';
import DripRateCalculator from '@/components/interactive/tools/DripRateCalculator';
import BodySurfaceAreaCalculator from '@/components/interactive/tools/BodySurfaceAreaCalculator';
import BMICalculator from '@/components/interactive/tools/BMICalculator';
import CervicalCollarSizeCalculator from '@/components/interactive/tools/CervicalCollarSizeCalculator';
import InfusionTableView from '@/components/interactive/tools/InfusionTableView';
import { infusionTables } from '@/data/calculators';
import { Link } from 'react-router-dom';
import AnatomicalTerminologyGuide from '@/components/content/references/AnatomicalTerminologyGuide';
import { featureFlags } from '@/config/featureFlags';
import SmartPerfusionCalculator from '@/tools/smart-perfusions/SmartPerfusionCalculator';

const tabs = [
  { id: 'calculadoras', label: 'Calculadoras', icon: Calculator },
  { id: 'anatomia', label: 'Anatomía', icon: BookOpen },
  { id: 'codigos', label: 'Códigos', icon: AlertCircle },
  { id: 'perfusiones', label: 'Perfusiones', icon: Table },
];

const codigosProtocolo = [
  {
    name: 'Código Ictus',
    description: 'Activación ante sospecha de ictus agudo',
    path: '/ictus',
    color: 'bg-secondary',
  },
  {
    name: 'Código IAM',
    description: 'SCACEST - Infarto con elevación ST',
    path: '/patologias',
    color: 'bg-primary',
  },
  {
    name: 'Código Sepsis',
    description: 'Sospecha de sepsis severa / shock séptico',
    path: '/shock',
    color: 'bg-emergency-high',
  },
  {
    name: 'Código Parada',
    description: 'PCR - Parada cardiorrespiratoria',
    path: '/rcp',
    color: 'bg-primary',
  },
];

const checklistsInteractivas = [
  {
    name: 'Checklist Sepsis',
    description: 'Sepsis: checklist interactiva con temporizadores',
    path: '/checklists/sepsis',
    color: 'bg-emergency-high',
  },
  {
    name: 'Checklist Ictus',
    description: 'Ictus: checklist interactiva con tiempos clave',
    path: '/checklists/ictus',
    color: 'bg-secondary',
  },
  {
    name: 'Checklist Parada',
    description: 'Parada: checklist interactiva con RCP',
    path: '/checklists/parada',
    color: 'bg-primary',
  },
  {
    name: 'Checklist Parto',
    description: 'Parto inminente: pasos operativos',
    path: '/checklists/parto',
    color: 'bg-emergency-high',
  },
  {
    name: 'Checklist Anafilaxia',
    description: 'Adrenalina IM y soporte vital',
    path: '/checklists/anafilaxia',
    color: 'bg-emergency-high',
  },
  {
    name: 'Checklist Intoxicaciones',
    description: 'ABCDE, antidotos y descontaminacion',
    path: '/checklists/intoxicaciones',
    color: 'bg-secondary',
  },
  {
    name: 'Checklist Convulsiones',
    description: 'Crisis > 5 min: control de tiempos',
    path: '/checklists/convulsiones',
    color: 'bg-warning',
  },
  {
    name: 'Checklist Termicas',
    description: 'Hipo/Hipertermia: manejo inicial',
    path: '/checklists/termicas',
    color: 'bg-warning',
  },
];

const pathwaysGuiados = [
  {
    name: 'Pathway Shock Séptico',
    description: 'Flujo guiado para reconocimiento y tratamiento inicial',
    path: '/pathways/shock-septico',
    color: 'bg-emergency-high',
  },
];

const Herramientas = () => {
  const [activeTab, setActiveTab] = useState('calculadoras');
  const [perfusionsMode, setPerfusionsMode] = useState<'tabla' | 'avanzado'>('tabla');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Herramientas</h1>
        <p className="text-muted-foreground text-sm">
          Calculadoras, tablas y códigos
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'calculadoras' && (
        <div className="space-y-4">
          {featureFlags.vitalsDashboard && (
            <Link
              to="/advanced/vitals"
              className="block card-procedure hover:border-primary/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Panel de constantes</h3>
                  <p className="text-muted-foreground text-sm">
                    Calcula MAP, Shock Index, qSOFA y NEWS2
                  </p>
                </div>
              </div>
            </Link>
          )}
          {featureFlags.advancedTools && (
            <Link
              to="/advanced/broselow"
              className="block card-procedure hover:border-primary/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Pediatría rápida (Broselow)</h3>
                  <p className="text-muted-foreground text-sm">
                    Zona, peso estimado y material sugerido
                  </p>
                </div>
              </div>
            </Link>
          )}
          <GlasgowCalculator />
          <ParklandCalculator />
          <PediatricDoseCalculator />
          <RCPTimer />
          <OxygenDurationCalculator />
          <DripRateCalculator />
          <BodySurfaceAreaCalculator />
          <BMICalculator />
          <CervicalCollarSizeCalculator />
        </div>
      )}

      {activeTab === 'perfusiones' && (
        <div className="space-y-4">
          {featureFlags.smartPerfusions && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPerfusionsMode('tabla')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  perfusionsMode === 'tabla'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                Tabla
              </button>
              <button
                type="button"
                onClick={() => setPerfusionsMode('avanzado')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  perfusionsMode === 'avanzado'
                    ? 'bg-secondary text-secondary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                Modo avanzado
              </button>
            </div>
          )}

          {perfusionsMode === 'avanzado' && featureFlags.smartPerfusions ? (
            <SmartPerfusionCalculator />
          ) : (
            infusionTables.map((table) => (
              <InfusionTableView key={table.id} table={table} />
            ))
          )}
        </div>
      )}

      {activeTab === 'anatomia' && (
        <div className="space-y-4">
          <AnatomicalTerminologyGuide />
        </div>
      )}

      {activeTab === 'codigos' && (
        <div className="space-y-3">
          {codigosProtocolo.map((codigo) => (
            <Link
              key={codigo.name}
              to={codigo.path}
              className="block card-procedure hover:border-primary/50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-lg ${codigo.color} flex items-center justify-center`}
                >
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{codigo.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {codigo.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {featureFlags.interactiveChecklists &&
            checklistsInteractivas.map((codigo) => (
              <Link
                key={codigo.name}
                to={codigo.path}
                className="block card-procedure hover:border-primary/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${codigo.color} flex items-center justify-center`}
                  >
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{codigo.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {codigo.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          {featureFlags.pathways &&
            pathwaysGuiados.map((pathway) => (
              <Link
                key={pathway.name}
                to={pathway.path}
                className="block card-procedure hover:border-primary/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${pathway.color} flex items-center justify-center`}
                  >
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{pathway.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {pathway.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default Herramientas;
