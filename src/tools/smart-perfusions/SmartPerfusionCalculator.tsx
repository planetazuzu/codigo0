import { useEffect, useMemo, useState } from 'react';
import { calculateDropsPerMinute, calculatePerfusionMlPerHour } from '@/clinical/calculations';
import { usePatientSafe } from '@/clinical/patient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageLoader from '@/components/ui/PageLoader';

type PerfusionDrugKey = 'dopamina' | 'noradrenalina' | 'adrenalina';

interface PerfusionDrugConfig {
  id: PerfusionDrugKey;
  name: string;
  doseRange: { min: number; max: number };
  concentrations: Array<{ label: string; value: number }>;
}

const DRUGS: PerfusionDrugConfig[] = [
  {
    id: 'dopamina',
    name: 'Dopamina',
    doseRange: { min: 2, max: 20 },
    concentrations: [
      { label: 'Estándar 2000 mcg/ml', value: 2000 },
      { label: 'Concentrada 4000 mcg/ml', value: 4000 },
    ],
  },
  {
    id: 'noradrenalina',
    name: 'Noradrenalina',
    doseRange: { min: 0.05, max: 1 },
    concentrations: [
      { label: 'Estándar 80 mcg/ml', value: 80 },
      { label: 'Concentrada 160 mcg/ml', value: 160 },
    ],
  },
  {
    id: 'adrenalina',
    name: 'Adrenalina',
    doseRange: { min: 0.05, max: 0.5 },
    concentrations: [
      { label: 'Estándar 10 mcg/ml', value: 10 },
      { label: 'Concentrada 20 mcg/ml', value: 20 },
    ],
  },
];

const formatValue = (value: number | string) => {
  if (typeof value !== 'number') return value;
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
};

const severityStyles = {
  green: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10',
  amber: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
  red: 'border-red-500/40 text-red-300 bg-red-500/10',
} as const;

const SmartPerfusionCalculator = () => {
  const { patient, setPatientBasics, hasPatientProperty } = usePatientSafe();
  const [drugKey, setDrugKey] = useState<PerfusionDrugKey>('noradrenalina');
  const [dose, setDose] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [concentration, setConcentration] = useState<string>('');

  const drugConfig = useMemo(
    () => DRUGS.find((drug) => drug.id === drugKey) ?? DRUGS[0],
    [drugKey],
  );

  // Cláusula de guarda: inicializar peso desde contexto si está disponible
  useEffect(() => {
    if (hasPatientProperty('weight') && patient.weight && weight === '') {
      setWeight(patient.weight.toString());
    }
  }, [patient.weight, weight, hasPatientProperty]);

  useEffect(() => {
    if (!concentration && drugConfig.concentrations.length > 0) {
      setConcentration(drugConfig.concentrations[0].value.toString());
    }
  }, [concentration, drugConfig]);

  const weightValue = Number(weight);
  const doseValue = Number(dose);
  const concentrationValue = Number(concentration);

  const perfusionResult = useMemo(() => (
    calculatePerfusionMlPerHour({
      weightKg: Number.isFinite(weightValue) ? weightValue : undefined,
      doseMcgKgMin: Number.isFinite(doseValue) ? doseValue : undefined,
      concentrationMcgMl: Number.isFinite(concentrationValue) ? concentrationValue : undefined,
      doseRange: drugConfig.doseRange,
    })
  ), [weightValue, doseValue, concentrationValue, drugConfig]);

  const dropsResult = useMemo(() => {
    const mlPerHour = typeof perfusionResult.value === 'number' ? perfusionResult.value : undefined;
    return calculateDropsPerMinute(mlPerHour);
  }, [perfusionResult]);

  const handleWeightChange = (value: string) => {
    setWeight(value);
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      setPatientBasics({ weight: numeric });
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>Modo avanzado</AlertTitle>
        <AlertDescription>
          Calcula ml/h y gotas/min a partir de peso, dosis y concentración.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parámetros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Fármaco</Label>
            <Select value={drugKey} onValueChange={(value) => setDrugKey(value as PerfusionDrugKey)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona fármaco" />
              </SelectTrigger>
              <SelectContent>
                {DRUGS.map((drug) => (
                  <SelectItem key={drug.id} value={drug.id}>
                    {drug.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Peso (kg)</Label>
            <Input
              type="number"
              inputMode="numeric"
              value={weight}
              onChange={(event) => handleWeightChange(event.target.value)}
              placeholder="Ej: 70"
            />
          </div>
          <div className="space-y-2">
            <Label>Dosis (mcg/kg/min)</Label>
            <Input
              type="number"
              inputMode="decimal"
              value={dose}
              onChange={(event) => setDose(event.target.value)}
              placeholder={`Rango ${drugConfig.doseRange.min}-${drugConfig.doseRange.max}`}
            />
          </div>
          <div className="space-y-2">
            <Label>Concentración</Label>
            <Select value={concentration} onValueChange={setConcentration}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona concentración" />
              </SelectTrigger>
              <SelectContent>
                {drugConfig.concentrations.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Resultado ml/h</CardTitle>
            <Badge className={`border ${severityStyles[perfusionResult.severity]}`}>
              {perfusionResult.severity.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">
              {formatValue(perfusionResult.value)} ml/h
            </div>
            <p className="text-sm text-muted-foreground">{perfusionResult.interpretation}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Goteo</CardTitle>
            <Badge className={`border ${severityStyles[dropsResult.severity]}`}>
              {dropsResult.severity.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-semibold">
              {formatValue(dropsResult.value)} gotas/min
            </div>
            <p className="text-sm text-muted-foreground">{dropsResult.interpretation}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartPerfusionCalculator;
