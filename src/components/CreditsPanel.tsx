import { Button } from "@/components/ui/button";
import { CREDITS } from "@/game/credits";

export default function CreditsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="panel w-full max-w-lg max-h-[90vh] overflow-y-auto p-7 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Ficha del proyecto</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight">Créditos</h2>

        <Section title="Autores">
          <ul className="space-y-1.5">
            {CREDITS.autores.map((a) => (
              <li key={a} className="flex gap-3 text-sm">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Docente">
          <p className="text-sm font-semibold">{CREDITS.docente}</p>
        </Section>

        <Section title="Asignatura">
          <p className="text-sm">
            {CREDITS.asignatura} · {CREDITS.grupo}
          </p>
        </Section>

        <Section title="Institución">
          <p className="text-sm">
            {CREDITS.universidad}
            <br />
            {CREDITS.facultad}
            <br />
            {CREDITS.departamento}
          </p>
        </Section>

        <Button
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground transition hover:scale-[1.02]"
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-border pt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}
