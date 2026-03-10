import type { EmergencySituation } from '@/services/emergency.service';

interface EmergencySituationSelectorProps {
  onSelect: (situation: EmergencySituation) => void;
}

const EmergencySituationSelector = ({ onSelect }: EmergencySituationSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">¿Qué está pasando ahora mismo?</h2>
        <p className="text-sm text-white/80">Selecciona la opción que mejor encaje.</p>
      </div>

      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => onSelect('medica')}
          className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-5 text-lg font-semibold text-white hover:bg-white/20"
        >
          Emergencia médica
        </button>
        <button
          type="button"
          onClick={() => onSelect('accidente')}
          className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-5 text-lg font-semibold text-white hover:bg-white/20"
        >
          Accidente
        </button>
        <button
          type="button"
          onClick={() => onSelect('tecnico')}
          className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-5 text-lg font-semibold text-white hover:bg-white/20"
        >
          Incidente técnico
        </button>
        <button
          type="button"
          onClick={() => onSelect('otro')}
          className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-5 text-lg font-semibold text-white hover:bg-white/20"
        >
          Otro
        </button>
      </div>
    </div>
  );
};

export default EmergencySituationSelector;
