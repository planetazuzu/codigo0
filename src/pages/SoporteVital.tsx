import ProcedureCard from '@/components/content/procedures/ProcedureCard';
import { useProcedureFilters } from '@/hooks/useProcedureFilters';
import type { Procedure } from '@/data/procedures';

const subcategories = [
  { id: 'todos', label: 'Todos' },
  { id: 'rcp', label: 'RCP' },
  { id: 'via_aerea', label: 'Vía Aérea' },
  { id: 'shock', label: 'Shock' },
];

const SoporteVital = () => {
  // Usar hook de filtrado de procedimientos (extrae toda la lógica de negocio)
  const {
    filteredProcedures,
    activeSubcategory,
    setActiveSubcategory,
    highlightId,
  } = useProcedureFilters('soporte_vital');

  // Filtrar solo procedimientos válidos (con id) para evitar accesos undefined
  const safeProcedures = (filteredProcedures ?? []).filter(
    (p): p is Procedure => p != null && typeof p === 'object' && 'id' in p && typeof (p as Procedure).id === 'string'
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Soporte Vital</h1>
        <p className="text-muted-foreground text-sm">
          Protocolos de emergencia y reanimación
        </p>
      </div>

      {/* Subcategory Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {subcategories.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubcategory(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeSubcategory === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Procedures List */}
      <div className="space-y-4">
        {safeProcedures.map((procedure) => (
          <ProcedureCard
            key={procedure.id}
            procedure={procedure}
            defaultExpanded={procedure.id === highlightId}
          />
        ))}
      </div>

      {safeProcedures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No hay protocolos en esta categoría
          </p>
        </div>
      )}
    </div>
  );
};

export default SoporteVital;
