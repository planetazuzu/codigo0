import { useEffect, useMemo, useState } from 'react';
import type { EmergencySituation } from '@/services/emergency.service';
import { notifyCoordinator, updateEmergencyEvent } from '@/services/emergency.service';

interface EmergencyInstructionsProps {
  eventId: string;
  situation: EmergencySituation;
  onClose: () => void;
  onRestart: () => void;
  isOnline: boolean;
}

const situationLabels: Record<EmergencySituation, string> = {
  medica: 'Emergencia médica',
  accidente: 'Accidente',
  tecnico: 'Incidente técnico',
  otro: 'Otro',
};

const situationSteps: Record<EmergencySituation, string[]> = {
  medica: [
    'Respira hondo y habla en voz calmada.',
    'Asegura la zona si es posible.',
    'Comprueba conciencia y respiración.',
    'Sigue las instrucciones en pantalla.',
  ],
  accidente: [
    'Respira hondo y mantén la calma.',
    'Asegura la zona y evita nuevos riesgos.',
    'Cuenta rápidamente cuántas personas necesitan ayuda.',
    'Sigue las instrucciones en pantalla.',
  ],
  tecnico: [
    'Respira hondo y reduce la velocidad.',
    'Detén el uso del equipo si es seguro hacerlo.',
    'Aísla la zona para evitar más daños.',
    'Sigue las instrucciones en pantalla.',
  ],
  otro: [
    'Respira hondo y observa el entorno.',
    'Asegura la zona si es posible.',
    'Identifica la prioridad más urgente.',
    'Sigue las instrucciones en pantalla.',
  ],
};

const EmergencyInstructions = ({
  eventId,
  situation,
  onClose,
  onRestart,
  isOnline,
}: EmergencyInstructionsProps) => {
  const [notificationStatus, setNotificationStatus] = useState<'idle' | 'sent' | 'queued'>('idle');

  useEffect(() => {
    updateEmergencyEvent(eventId, { status: 'instructions' });
  }, [eventId]);

  useEffect(() => {
    let isMounted = true;
    const sendNotification = async () => {
      const result = await notifyCoordinator(eventId);
      if (isMounted) {
        setNotificationStatus(result);
      }
    };
    sendNotification();
    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const steps = useMemo(() => situationSteps[situation], [situation]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-sm uppercase tracking-wide text-white/70">No estás solo. Sigue estos pasos.</div>
        <h2 className="text-2xl font-bold text-white">{situationLabels[situation]}</h2>
        <p className="text-sm text-white/80">Una acción clara por paso. Vamos contigo.</p>
      </div>

      <div className="rounded-xl border border-white/20 bg-white/10 p-5 space-y-4">
        {steps.map((step) => (
          <div key={step} className="flex items-start gap-3 text-white text-lg">
            <span className="mt-1 h-3 w-3 rounded-full bg-white" />
            <span>{step}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/20 bg-white/5 p-4 text-white/80 text-sm">
        {notificationStatus === 'sent' && 'Coordinación notificada.'}
        {notificationStatus === 'queued' && 'Aviso guardado para sincronizar.'}
        {notificationStatus === 'idle' && 'Preparando aviso a coordinación...'}
      </div>

      {isOnline ? (
        <div className="grid gap-3">
          <a
            href="tel:112"
            className="w-full rounded-xl bg-white px-4 py-4 text-center text-lg font-semibold text-red-700"
          >
            Llamar al 112
          </a>
          <a
            href="sms:112"
            className="w-full rounded-xl border-2 border-white/40 px-4 py-4 text-center text-lg font-semibold text-white"
          >
            Enviar mensaje rápido
          </a>
        </div>
      ) : (
        <div className="rounded-xl border border-white/30 bg-white/10 p-4 text-white text-sm">
          Sin conexión. Seguimos en modo offline y guardamos el evento para sincronizar después.
        </div>
      )}

      <div className="grid gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="w-full rounded-xl border-2 border-white/40 px-4 py-3 text-base font-semibold text-white"
        >
          Cambiar situación
        </button>
        <button
          type="button"
          onClick={() => {
            updateEmergencyEvent(eventId, { status: 'completed' });
            onClose();
          }}
          className="w-full rounded-xl bg-white/20 px-4 py-3 text-base font-semibold text-white"
        >
          Cerrar modo emergencia
        </button>
      </div>
    </div>
  );
};

export default EmergencyInstructions;
