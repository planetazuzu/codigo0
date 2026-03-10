import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Pill, ArrowRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch, type SearchResult, type FilterType, type CategoryFilter } from '@/hooks/useSearch';
import type { Category } from '@/data/procedures';
import type { DrugCategory } from '@/data/drugs';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addToHistory } = useSearchHistory();
  
  // Debounce del query para evitar búsquedas excesivas mientras el usuario escribe
  const debouncedQuery = useDebounce(query, 300);

  // Usar hook de búsqueda con validación
  const { results, isSearching, error } = useSearch(debouncedQuery, typeFilter, categoryFilter);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Categorías para los filtros
  const procedureCategories: Category[] = ['soporte_vital', 'patologias', 'escena'];
  const drugCategories: DrugCategory[] = ['cardiovascular', 'respiratorio', 'neurologico', 'analgesia', 'oxigenoterapia', 'otros'];

  // Resetear filtros cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setTypeFilter('all');
      setCategoryFilter('all');
      setQuery('');
    }
  }, [isOpen]);

  const handleResultClick = (result: SearchResult | null) => {
    // Cláusula de guarda: verificar que el resultado existe y tiene id
    if (!result?.id) {
      console.warn('[SearchModal] Intento de navegar a resultado sin ID');
      return;
    }

    // Añadir al historial
    addToHistory({
      id: result.id,
      type: result.type,
      title: result.title,
      path: result.type === 'procedure' 
        ? `/soporte-vital?id=${result.id}`
        : `/farmacos?id=${result.id}`,
    });

    if (result.type === 'procedure') {
      navigate(`/soporte-vital?id=${result.id}`);
    } else {
      navigate(`/farmacos?id=${result.id}`);
    }
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar protocolo, fármaco, calculadora..."
              className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={onClose}
            className="w-14 h-14 flex items-center justify-center rounded-xl bg-card border border-border hover:bg-muted transition-colors"
            aria-label="Cerrar búsqueda"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-touch">
          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
              <p className="text-foreground font-medium">Error en la búsqueda</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          )}
          {!error && isSearching ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-foreground font-medium">Buscando...</p>
              <p className="text-sm text-muted-foreground mt-1">Por favor espera</p>
            </div>
          ) : !error && results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result) => {
                // Cláusula de guarda: verificar que el resultado tiene id antes de renderizar
                if (!result?.id) {
                  return null;
                }
                
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 active:bg-muted/50 active:scale-[0.99] transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      {result.type === 'procedure' ? (
                        <FileText className="w-5 h-5 text-primary" />
                      ) : (
                        <Pill className="w-5 h-5 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{result.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {result.subtitle && (
                          <p className="text-sm text-muted-foreground capitalize truncate">
                            {result.subtitle}
                          </p>
                        )}
                        {result.priority && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            result.priority === 'critico' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                            result.priority === 'alto' ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400' :
                            result.priority === 'medio' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                            'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          }`}>
                            {result.priority}
                          </span>
                        )}
                        {result.ageGroup && result.ageGroup !== 'todos' && (
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {result.ageGroup}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          ) : debouncedQuery.length >= 2 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-foreground">No se encontraron resultados</p>
              <p className="text-sm text-muted-foreground mt-1">Intenta con otros términos</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-foreground">Escribe para buscar</p>
              <p className="text-sm text-muted-foreground mt-1">Protocolos, fármacos, calculadoras...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
