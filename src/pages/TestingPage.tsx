/**
 * Página de Testing del Sistema de Contenido
 * 
 * Permite verificar que todos los componentes del sistema funcionan correctamente
 */

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { 
  runAllBasicTests, 
  formatTestResults, 
  type TestResult,
  testGetSpecificProtocol,
  testProtocolToGuideRelations,
  testGuideToProtocolRelations,
  testContentPackCache
} from '@/utils/testing-helpers';
import BackButton from '@/components/ui/BackButton';

export default function TestingPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runTests = async () => {
    setIsRunning(true);
    try {
      const testResults = runAllBasicTests();
      setResults(testResults);
      setLastRun(new Date());
      
      // Mostrar resultados en consola también
      console.log(formatTestResults(testResults));
    } catch (error) {
      console.error('Error ejecutando tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runSpecificTest = (testFn: () => TestResult) => {
    const result = testFn();
    setResults(prev => {
      const filtered = prev.filter(r => r.name !== result.name);
      return [...filtered, result];
    });
  };

  useEffect(() => {
    // Ejecutar tests automáticamente al cargar
    runTests();
  }, []);

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const percentage = totalCount > 0 ? ((passedCount / totalCount) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <BackButton to="/" label="Volver al inicio" />
      
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testing del Sistema</h1>
          <p className="text-muted-foreground">
            Verificación del sistema de contenido y enlaces bidireccionales
          </p>
        </div>

        {/* Resumen */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Resumen de Tests</h2>
              {lastRun && (
                <p className="text-sm text-muted-foreground">
                  Última ejecución: {lastRun.toLocaleTimeString()}
                </p>
              )}
            </div>
            <Button 
              onClick={runTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Ejecutar Tests
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-foreground">{passedCount}</div>
              <div className="text-sm text-muted-foreground">Pasados</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-foreground">{totalCount - passedCount}</div>
              <div className="text-sm text-muted-foreground">Fallidos</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-3xl font-bold text-foreground">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Éxito</div>
            </div>
          </div>
        </Card>

        {/* Barra de progreso */}
        {totalCount > 0 && (
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}

        {/* Resultados detallados */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Resultados Detallados</h2>
          
          {results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay resultados de tests aún.</p>
              <p className="text-sm mt-2">Haz clic en "Ejecutar Tests" para comenzar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    result.passed
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-foreground mb-1">
                        {result.name}
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {result.message}
                      </div>
                      {result.details && Object.keys(result.details).length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                            Ver detalles
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Tests rápidos */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Tests Rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => runSpecificTest(() => testGetSpecificProtocol('rcp-adulto-svb'))}
            >
              Test RCP
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => runSpecificTest(() => testProtocolToGuideRelations('rcp-adulto-svb'))}
            >
              Test Relaciones
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => runSpecificTest(() => testGuideToProtocolRelations('rcp-adulto-svb'))}
            >
              Test Guía→Protocolo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => runSpecificTest(() => testContentPackCache())}
            >
              Test Cache
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

