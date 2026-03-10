import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { calculateMAP, calculateNEWS2, calculateShockIndex, calculateqSOFA } from '@/clinical/calculations';
import { usePatientSafe } from '@/clinical/patient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const toNumber = (value: string): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const severityOrder = {
  green: 0,
  amber: 1,
  red: 2,
} as const;

const severityStyles: Record<keyof typeof severityOrder, string> = {
  green: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  amber: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
  red: 'border-red-500/40 text-red-300 bg-red-500/10',
};

const severityLabels: Record<keyof typeof severityOrder, string> = {
  green: 'Estable',
  amber: 'Vigilancia',
  red: 'Crítico',
};

const formatValue = (value: number | string) => {
  if (typeof value !== 'number') return value;
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
};

const VitalsDashboard = () => {
  const { vitals, updateVitals } = usePatientSafe();

  const mapResult = useMemo(
    () => calculateMAP(vitals.systolicBP, vitals.diastolicBP),
    [vitals.systolicBP, vitals.diastolicBP],
  );
  const shockResult = useMemo(
    () => calculateShockIndex(vitals.heartRate, vitals.systolicBP),
    [vitals.heartRate, vitals.systolicBP],
  );
  const qsofaResult = useMemo(
    () => calculateqSOFA(vitals),
    [vitals],
  );
  const newsResult = useMemo(
    () => calculateNEWS2(vitals),
    [vitals],
  );

  const highestSeverity = useMemo(() => {
    const results = [mapResult, shockResult, qsofaResult, newsResult];
    return results.reduce((current, result) => (
      severityOrder[result.severity] > severityOrder[current] ? result.severity : current
    ), 'green' as keyof typeof severityOrder);
  }, [mapResult, shockResult, qsofaResult, newsResult]);

  const newsScore = typeof newsResult.value === 'number' ? newsResult.value : null;
  const qsofaScore = typeof qsofaResult.value === 'number' ? qsofaResult.value : null;
  const mapScore = typeof mapResult.value === 'number' ? mapResult.value : null;
  const shockScore = typeof shockResult.value === 'number' ? shockResult.value : null;

  const sepsisAlert = newsScore !== null && newsScore >= 5 && qsofaScore !== null && qsofaScore >= 2;
  const shockAlert = shockScore !== null && shockScore > 1 && mapScore !== null && mapScore < 65;

  const alertConfig = useMemo(() => {
    if (sepsisAlert) {
      return {
        severity: 'red' as const,
        title: 'SOSPECHA SEPSIS GRAVE',
        description: 'NEWS2 ≥ 5 y qSOFA ≥ 2. Valorar activar protocolo de sepsis.',
        action: {
          label: 'Código Sepsis (próximamente)',
          disabled: true,
        },
      };
    }

    if (shockAlert) {
      return {
        severity: 'red' as const,
        title: 'SHOCK HIPOTENSIVO',
        description: 'Shock Index > 1 y MAP < 65. Considerar vasopresores.',
        action: {
          label: 'Ir a Perfusiones',
          to: '/herramientas',
          disabled: false,
        },
      };
    }

    return {
      severity: highestSeverity,
      title: `Estado general: ${severityLabels[highestSeverity]}`,
      description: 'Basado en MAP, Shock Index, qSOFA y NEWS2.',
      action: null,
    };
  }, [sepsisAlert, shockAlert, highestSeverity]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Panel de Signos Vitales</h1>
        <p className="text-sm text-muted-foreground">
          Introduce los signos vitales una sola vez para obtener alertas integradas.
        </p>
      </header>

      <Alert className={`border ${severityStyles[alertConfig.severity]}`}>
        <AlertTitle className="text-base">{alertConfig.title}</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <p className="text-sm">{alertConfig.description}</p>
          {alertConfig.action ? (
            alertConfig.action.disabled ? (
              <Button variant="outline" disabled>
                {alertConfig.action.label}
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link to={alertConfig.action.to}>{alertConfig.action.label}</Link>
              </Button>
            )
          ) : null}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Entrada rápida</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="heartRate">Frecuencia cardiaca (lpm)</Label>
            <Input
              id="heartRate"
              type="number"
              inputMode="numeric"
              value={vitals.heartRate ?? ''}
              onChange={(event) => updateVitals({ heartRate: toNumber(event.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="systolicBP">TA sistólica (mmHg)</Label>
            <Input
              id="systolicBP"
              type="number"
              inputMode="numeric"
              value={vitals.systolicBP ?? ''}
              onChange={(event) => updateVitals({ systolicBP: toNumber(event.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="diastolicBP">TA diastólica (mmHg)</Label>
            <Input
              id="diastolicBP"
              type="number"
              inputMode="numeric"
              value={vitals.diastolicBP ?? ''}
              onChange={(event) => updateVitals({ diastolicBP: toNumber(event.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="respiratoryRate">Frecuencia respiratoria (rpm)</Label>
            <Input
              id="respiratoryRate"
              type="number"
              inputMode="numeric"
              value={vitals.respiratoryRate ?? ''}
              onChange={(event) => updateVitals({ respiratoryRate: toNumber(event.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperatureC">Temperatura (°C)</Label>
            <Input
              id="temperatureC"
              type="number"
              inputMode="decimal"
              step="0.1"
              value={vitals.temperatureC ?? ''}
              onChange={(event) => updateVitals({ temperatureC: toNumber(event.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oxygenSaturation">SpO₂ (%)</Label>
            <Input
              id="oxygenSaturation"
              type="number"
              inputMode="numeric"
              value={vitals.oxygenSaturation ?? ''}
              onChange={(event) => updateVitals({ oxygenSaturation: toNumber(event.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gcs">Glasgow (GCS)</Label>
            <Input
              id="gcs"
              type="number"
              inputMode="numeric"
              value={vitals.gcs ?? ''}
              onChange={(event) => updateVitals({ gcs: toNumber(event.target.value) })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[{
          title: 'MAP',
          result: mapResult,
        }, {
          title: 'Shock Index',
          result: shockResult,
        }, {
          title: 'qSOFA',
          result: qsofaResult,
        }, {
          title: 'NEWS2',
          result: newsResult,
        }].map(({ title, result }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">{title}</CardTitle>
              <Badge className={`border ${severityStyles[result.severity]}`}>
                {severityLabels[result.severity]}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-semibold">
                {formatValue(result.value)}
              </div>
              <p className="text-sm text-muted-foreground">{result.interpretation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VitalsDashboard;
