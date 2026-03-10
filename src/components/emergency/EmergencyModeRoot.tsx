import { useState } from 'react';
import EmergencyButton from './EmergencyButton';
import EmergencyModeOverlay from './EmergencyModeOverlay';

/**
 * Punto de integración aislado del módulo de emergencia.
 * Mantiene estado local y no altera flujos existentes.
 */
const EmergencyModeRoot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <EmergencyButton onClick={() => setIsOpen(true)} isActive={isOpen} />
      <EmergencyModeOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default EmergencyModeRoot;
