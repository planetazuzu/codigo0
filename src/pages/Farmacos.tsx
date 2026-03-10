import { useState } from 'react';
import { Search, Info, BookOpen, Cloud } from 'lucide-react';
import { useContentAdapter } from '@/services/content-adapter';
import type { DrugCategory } from '@/data/drugs';
import { TESMedication } from '@/data/tes-medication';
import { useDrugFilters } from '@/hooks/useDrugFilters';
import DrugCard from '@/components/drugs/DrugCard';
import TESMedicationCard from '@/components/drugs/TESMedicationCard';
import DrugAdministrationGuide from '@/components/drugs/DrugAdministrationGuide';
import PharmaceuticalTerminologyGuide from '@/components/drugs/PharmaceuticalTerminologyGuide';

const categories: { id: DrugCategory | 'todos' | 'tes'; label: string }[] = [
  { id: 'tes', label: 'Medicación TES' },
  { id: 'todos', label: 'Todos' },
  { id: 'oxigenoterapia', label: 'Oxigenoterapia' },
  { id: 'cardiovascular', label: 'Cardiovascular' },
  { id: 'respiratorio', label: 'Respiratorio' },
  { id: 'neurologico', label: 'Neurológico' },
  { id: 'analgesia', label: 'Analgesia' },
  { id: 'otros', label: 'Otros' },
];

const tesCategories: { id: TESMedication['category'] | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'hipoglucemia', label: 'Hipoglucemias' },
  { id: 'respiratorio', label: 'Crisis Respiratorias' },
  { id: 'anafilaxia', label: 'Crisis Anafilácticas' },
];

const Farmacos = () => {
  const { isExternal } = useContentAdapter();
  const [showAdministrationGuide, setShowAdministrationGuide] = useState(true);
  const [showTerminologyGuide, setShowTerminologyGuide] = useState(false);
  
  // Usar hook de filtrado de fármacos (extrae toda la lógica de negocio)
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    activeTESCategory,
    setActiveTESCategory,
    filteredTESMedications,
    filteredDrugs,
    highlightId,
  } = useDrugFilters();

  // Filtrar solo fármacos y medicaciones válidos (con id) para evitar accesos undefined
  const safeDrugs = (filteredDrugs ?? []).filter(
    (d) => d != null && typeof d === 'object' && 'id' in d && typeof (d as { id: string }).id === 'string'
  );
  const safeTESMedications = (filteredTESMedications ?? []).filter(
    (m) => m != null && typeof m === 'object' && 'id' in m && typeof (m as { id: string }).id === 'string'
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Fármacos</h1>
            {isExternal && (
              <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-md">
                <Cloud className="w-3 h-3" /> Externo
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Vademécum de emergencias
          </p>
        </div>
      </div>

      {/* Guía de Principios de Administración */}
      {showAdministrationGuide && (
        <DrugAdministrationGuide onClose={() => setShowAdministrationGuide(false)} />
      )}

      {/* Guía de Terminología */}
      {showTerminologyGuide && (
        <PharmaceuticalTerminologyGuide onClose={() => setShowTerminologyGuide(false)} />
      )}

      {!showAdministrationGuide && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setShowAdministrationGuide(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Info className="w-4 h-4" />
            Ver Principios de Administración
          </button>
          <button
            onClick={() => setShowTerminologyGuide(!showTerminologyGuide)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {showTerminologyGuide ? 'Ocultar' : 'Ver'} Abreviaturas y Terminología
          </button>
        </div>
      )}

      {/* Guía de Terminología */}
      {showTerminologyGuide && (
        <PharmaceuticalTerminologyGuide onClose={() => setShowTerminologyGuide(false)} />
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar fármaco..."
          className="w-full h-12 pl-12 pr-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* TES Medication Subcategories */}
      {activeCategory === 'tes' && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
          {tesCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTESCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTESCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* TES Medications List */}
      {activeCategory === 'tes' && (
        <div className="space-y-4">
          {filteredTESMedications.map((medication) => (
            <TESMedicationCard
              key={medication.id}
              medication={medication}
            />
          ))}
          {filteredTESMedications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron medicaciones
              </p>
            </div>
          )}
        </div>
      )}

      {/* Drugs List (Vademécum completo) */}
      {activeCategory !== 'tes' && (
        <div className="space-y-4">
          {safeDrugs.map((drug) => (
            <DrugCard
              key={drug.id}
              drug={drug}
              defaultExpanded={drug.id === highlightId}
            />
          ))}
          {safeDrugs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No se encontraron fármacos
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Farmacos;
