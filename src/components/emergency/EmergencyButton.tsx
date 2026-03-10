import { AlertTriangle } from 'lucide-react';

interface EmergencyButtonProps {
  onClick: () => void;
  isActive?: boolean;
}

/**
 * Botón flotante de emergencia.
 * UX: siempre visible, alto contraste y tamaño amplio para uso con una mano.
 */
const EmergencyButton = ({ onClick, isActive }: EmergencyButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Activar modo emergencia"
      className={`fixed right-4 bottom-24 md:bottom-6 z-[999] flex items-center gap-2 rounded-full px-4 py-3 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
        isActive
          ? 'bg-red-700 text-white'
          : 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]'
      }`}
    >
      <AlertTriangle className="h-5 w-5" />
      <span className="text-base font-semibold">Emergencia</span>
    </button>
  );
};

export default EmergencyButton;
