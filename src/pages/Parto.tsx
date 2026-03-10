import { Link } from 'react-router-dom';
import { AlertTriangle, ChevronRight } from 'lucide-react';

const Parto = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Parto extrahospitalario</h1>
        <p className="text-muted-foreground text-sm">
          Acceso rápido. Contenido operativo en preparación.
        </p>
      </div>

      <div className="card-procedure">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[hsl(var(--emergency-high))]/15 text-[hsl(var(--emergency-high))] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold text-foreground">Guía en construcción</h2>
            <p className="text-sm text-muted-foreground">
              Esta sección se ampliará con protocolo completo y checklist clínica.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          to="/escena"
          className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          <span className="text-foreground">Actuación en escena</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
        <Link
          to="/herramientas"
          className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          <span className="text-foreground">Herramientas</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
        <Link
          to="/telefono"
          className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          <span className="text-foreground">Protocolos transtelefónicos</span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
};

export default Parto;
