import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';

interface NotFoundProps {
  /**
   * Mensaje personalizado de error
   */
  message?: string;
  /**
   * Ruta a la que volver (por defecto: "/")
   */
  backTo?: string;
  /**
   * Texto del botón de volver (por defecto: "Volver al inicio")
   */
  backLabel?: string;
  /**
   * Título personalizado (por defecto: "Recurso no encontrado")
   */
  title?: string;
}

/**
 * Componente reutilizable para mostrar estados de "no encontrado"
 * 
 * Usar cuando:
 * - Un recurso solicitado no existe
 * - Un parámetro de URL es inválido
 * - Datos críticos faltan y no se puede renderizar la página
 */
const NotFound = ({
  message = 'El recurso solicitado no está disponible',
  backTo = '/',
  backLabel = 'Volver al inicio',
  title = 'Recurso no encontrado',
}: NotFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4">
      <AlertTriangle className="w-12 h-12 text-destructive" />
      <h2 className="text-xl font-semibold text-foreground text-center">
        {title}
      </h2>
      <p className="text-muted-foreground text-center max-w-md">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <BackButton to={backTo} label={backLabel} />
        <Link
          to="/"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
