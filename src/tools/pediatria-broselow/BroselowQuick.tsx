import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import RCPTimer from '@/components/interactive/tools/RCPTimer';
import { broselowZones, type BroselowZone } from './broselowData';

type InputMode = 'length' | 'weight';

const findZoneByLength = (lengthCm: number) =>
  broselowZones.find(
    (zone) => lengthCm >= zone.lengthMinCm && lengthCm <= zone.lengthMaxCm,
  );

const findZoneByWeight = (weightKg: number) =>
  broselowZones.find(
    (zone) => weightKg >= zone.weightMinKg && weightKg <= zone.weightMaxKg,
  );

const getMidWeight = (zone: BroselowZone) =>
  Math.round(((zone.weightMinKg + zone.weightMaxKg) / 2) * 10) / 10;

const BroselowQuick = () => {
  const [lengthCm, setLengthCm] = useState<string>('');
  const [weightKg, setWeightKg] = useState<string>('');
  const [mode, setMode] = useState<InputMode>('length');

  const lengthValue = Number(lengthCm);
  const weightValue = Number(weightKg);

  const zoneByLength = useMemo(() => {
    if (!Number.isFinite(lengthValue) || lengthValue <= 0) return undefined;
    return findZoneByLength(lengthValue);
  }, [lengthValue]);

  const zoneByWeight = useMemo(() => {
    if (!Number.isFinite(weightValue) || weightValue <= 0) return undefined;
    return findZoneByWeight(weightValue);
  }, [weightValue]);

  const selectedZone = mode === 'length' ? zoneByLength : zoneByWeight;
  const mismatch =
    zoneByLength && zoneByWeight && zoneByLength.id !== zoneByWeight.id;

  const resetInputs = () => {
    setLengthCm('');
    setWeightKg('');
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Pediatría rápida (Broselow)</h1>
        <p className="text-sm text-muted-foreground">
          Estimación rápida por talla/peso para dosis y material. Usar siempre cinta Broselow
          oficial y protocolos locales.
        </p>
      </header>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base">Entrada principal</CardTitle>
          <p className="text-sm text-muted-foreground">
            Selecciona el modo (talla o peso) y completa el valor disponible.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={mode === 'length' ? 'default' : 'outline'}
              onClick={() => setMode('length')}
            >
              Por talla
            </Button>
            <Button
              type="button"
              variant={mode === 'weight' ? 'default' : 'outline'}
              onClick={() => setMode('weight')}
            >
              Por peso
            </Button>
            <Button type="button" variant="outline" onClick={resetInputs}>
              Limpiar
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="length">Talla (cm)</Label>
              <Input
                id="length"
                type="number"
                inputMode="decimal"
                placeholder="Ej: 92"
                value={lengthCm}
                onChange={(event) => setLengthCm(event.target.value)}
                disabled={mode !== 'length'}
              />
            </div>
            <div>
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                inputMode="decimal"
                placeholder="Ej: 12"
                value={weightKg}
                onChange={(event) => setWeightKg(event.target.value)}
                disabled={mode !== 'weight'}
              />
            </div>
          </div>

          {selectedZone ? (
            <div className="rounded-lg border border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Zona</p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedZone.colorName}
                  </p>
                </div>
                <span
                  className="h-8 w-8 rounded-full border border-border"
                  style={{ backgroundColor: selectedZone.colorHex }}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-md bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Rango talla</p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedZone.lengthMinCm}-{selectedZone.lengthMaxCm} cm
                  </p>
                </div>
                <div className="rounded-md bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Rango peso</p>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedZone.weightMinKg}-{selectedZone.weightMaxKg} kg
                  </p>
                </div>
                <div className="rounded-md bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Peso estimado</p>
                  <p className="text-sm font-semibold text-foreground">
                    {getMidWeight(selectedZone)} kg
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">Material sugerido</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-md border border-border/60 p-3 text-sm text-muted-foreground">
                    <strong>TET sin balón:</strong> {selectedZone.equipment.ettUncuffed}
                  </div>
                  <div className="rounded-md border border-border/60 p-3 text-sm text-muted-foreground">
                    <strong>TET con balón:</strong> {selectedZone.equipment.ettCuffed}
                  </div>
                  <div className="rounded-md border border-border/60 p-3 text-sm text-muted-foreground">
                    <strong>Hoja laringo:</strong> {selectedZone.equipment.laryngoscopeBlade}
                  </div>
                  <div className="rounded-md border border-border/60 p-3 text-sm text-muted-foreground">
                    <strong>Sonda aspiración:</strong> {selectedZone.equipment.suctionCatheter}
                  </div>
                  <div className="rounded-md border border-border/60 p-3 text-sm text-muted-foreground">
                    <strong>Catéter IV:</strong> {selectedZone.equipment.ivCatheter}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
              Introduce una talla (46-134 cm) o un peso (3-29 kg) para obtener la zona.
            </div>
          )}

          {mismatch && (
            <div className="rounded-lg border border-[hsl(var(--emergency-medium))]/30 bg-[hsl(var(--emergency-medium))]/10 p-3 text-sm text-[hsl(var(--emergency-medium))]">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <div>
                  <p className="font-semibold">Talla y peso no coinciden</p>
                  <p className="text-xs text-muted-foreground">
                    Si tienes ambos datos, prioriza la talla medida con cinta Broselow.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Nota: valores aproximados para entrenamiento. Verificar siempre con cinta oficial y
            guía local.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <Link to="/herramientas" className="underline underline-offset-4">
            Abrir calculadora de dosis pediátricas
          </Link>
          <p>Temporizador RCP integrado abajo.</p>
        </CardContent>
      </Card>

      <RCPTimer />
    </div>
  );
};

export default BroselowQuick;
