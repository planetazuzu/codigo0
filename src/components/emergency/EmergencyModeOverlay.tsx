import { useEffect, useMemo, useState } from 'react';
import EmergencySituationSelector from './EmergencySituationSelector';
import EmergencyInstructions from './EmergencyInstructions';
import type { EmergencySituation } from '@/services/emergency.service';
import {
  createEmergencyEvent,
  getLocationSnapshot,
  updateEmergencyEvent,
} from '@/services/emergency.service';

interface EmergencyModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Overlay fullscreen autocontenido.
 * UX: bloquea navegación y centra la atención en un flujo lineal.
 */
const EmergencyModeOverlay = ({ isOpen, onClose }: EmergencyModeOverlayProps) => {
  const [stage, setStage] = useState<'select' | 'instructions'>('select');
  const [eventId, setEventId] = useState<string | null>(null);
  const [situation, setSituation] = useState<EmergencySituation | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;
    const event = createEmergencyEvent();
    setEventId(event.id);
    setStage('select');
    setSituation(null);

    getLocationSnapshot().then((location) => {
      if (isCancelled) return;
      if (location) {
        updateEmergencyEvent(event.id, { location });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const title = useMemo(() => {
    if (stage === 'select') return 'Estás en una situación crítica. Estamos contigo.';
    return 'No estás solo. Sigue estos pasos.';
  }, [stage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-between px-6 py-8">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-wide text-white/70">Modo Emergencia</p>
          <h1 className="text-3xl font-extrabold text-white">{title}</h1>
        </div>

        <div className="flex-1 py-8">
          {stage === 'select' && (
            <EmergencySituationSelector
              onSelect={(value) => {
                if (eventId) {
                  updateEmergencyEvent(eventId, {
                    situation: value,
                    status: 'situation_selected',
                  });
                }
                setSituation(value);
                setStage('instructions');
              }}
            />
          )}

          {stage === 'instructions' && eventId && situation && (
            <EmergencyInstructions
              eventId={eventId}
              situation={situation}
              isOnline={isOnline}
              onRestart={() => {
                setStage('select');
                setSituation(null);
              }}
              onClose={onClose}
            />
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl border border-white/30 px-4 py-3 text-base font-semibold text-white/80"
        >
          Salir del modo emergencia
        </button>
      </div>
    </div>
  );
};

export default EmergencyModeOverlay;