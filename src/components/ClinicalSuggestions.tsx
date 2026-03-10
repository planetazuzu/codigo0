import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { evaluateRules } from '@/clinical/rules/engine';
import { usePatientSafe } from '@/clinical/patient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const priorityStyles = {
  CRITICAL: 'border-red-500/50 bg-red-500/10 text-red-100',
  HIGH: 'border-amber-500/50 bg-amber-500/10 text-amber-100',
  MEDIUM: 'border-blue-500/40 bg-blue-500/10 text-blue-100',
} as const;

const ClinicalSuggestions = () => {
  const { patient, vitals } = usePatientSafe();
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});

  const suggestions = useMemo(() => {
    // Cláusula de guarda: solo evaluar si hay datos disponibles
    if (!patient && !vitals) {
      return [];
    }
    
    const evaluated = evaluateRules({ patient, vitals });
    return evaluated.filter((item) => !dismissed[item.id]).slice(0, 3);
  }, [patient, vitals, dismissed]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {suggestions.map((suggestion) => (
        <Card key={suggestion.id} className={`border ${priorityStyles[suggestion.priority]}`}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <CardTitle className="text-base">{suggestion.message}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed((prev) => ({ ...prev, [suggestion.id]: true }))}
            >
              Ocultar
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {suggestion.actions.map((action, index) => (
              action.route ? (
                <Button key={index} asChild variant="outline" size="sm">
                  <Link to={action.route}>{action.label}</Link>
                </Button>
              ) : (
                <Button key={index} variant="outline" size="sm" disabled>
                  {action.label}
                </Button>
              )
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClinicalSuggestions;
