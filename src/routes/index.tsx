import { createFileRoute } from "@tanstack/react-router";
import { useReducer, useState } from "react";
import HouseScene from "@/components/HouseScene";
import { DEVICES } from "@/game/devices";
import { evaluationReducer, initialEvaluation } from "@/game/evaluation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CREDITS } from "@/game/credits";
import CreditsPanel from "@/components/CreditsPanel";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Casa Ubicua — Juego de computación ubicua | Fundamentos de IoT" },
      { name: "description", content: "Explora una casa en 3D e identifica los dispositivos de computación ubicua. Recibe tu nota de 0 a 5." },
      { property: "og:title", content: "Casa Ubicua — Juego de Fundamentos de IoT" },
      { property: "og:description", content: "Encuentra los dispositivos de computación ubicua escondidos en la casa y obtén tu calificación." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

function Game() {
  const [{ phase, selected, result, student }, dispatch] = useReducer(evaluationReducer, undefined, initialEvaluation);
  const [credits, setCredits] = useState(false);
  const [name, setName] = useState("");
  const toggle = (id: string) => dispatch({ type: "toggle", id });
  const finish = () => dispatch({ type: "grade" });

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      {phase !== "result" && <HouseScene selected={selected} onToggle={toggle} locked={phase !== "play"} />}

      {/* HUD */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-2 sm:gap-3 sm:p-4 md:p-6">
        <div className="panel pointer-events-auto max-w-[58%] px-3 py-2 sm:max-w-none sm:px-5 sm:py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs sm:tracking-[0.2em]">
            Fundamentos de IoT · Grupo 1
          </p>
          <h1 className="text-lg font-semibold leading-tight sm:text-2xl md:text-3xl">Casa Ubicua</h1>
          <p className="hidden text-xs text-muted-foreground sm:block">{CREDITS.universidad}</p>
        </div>
        <div className="pointer-events-auto flex max-w-[42%] flex-col items-stretch gap-2 sm:max-w-none sm:flex-row sm:items-start sm:gap-3">
          {phase === "play" && (
            <div className="panel flex flex-col items-stretch gap-2 px-3 py-2 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-3">
              <div className="text-left sm:text-right">
                <p className="truncate text-[10px] text-muted-foreground sm:max-w-48 sm:text-xs" title={student}>
                  {student} · Marcados
                </p>
                <p className="font-display text-xl font-semibold sm:text-2xl">{selected.size}</p>
              </div>
              <Button
                onClick={finish}
                className="h-9 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:scale-105 sm:h-10 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                <span className="sm:hidden">Terminar</span>
                <span className="hidden sm:inline">Terminar y calificar</span>
              </Button>
            </div>
          )}
          {phase !== "intro" && (
            <Button variant="outline" size="sm" className="h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm" onClick={() => setCredits(true)}>
              Créditos
            </Button>
          )}
        </div>
      </header>

      {phase === "play" && (
        <p className="panel pointer-events-none absolute bottom-3 left-1/2 z-10 w-[min(92vw,36rem)] -translate-x-1/2 px-3 py-2 text-center text-[11px] leading-snug text-muted-foreground sm:bottom-4 sm:px-4 sm:text-sm">
          <span className="sm:hidden">Toca para marcar · Un dedo gira · Dos dedos mueven/zoom</span>
          <span className="hidden sm:inline">Clic para marcar · Arrastra para girar · Clic derecho o dos dedos para moverte · Rueda para zoom</span>
        </p>
      )}

      {phase === "intro" && (
        <div className="absolute inset-0 z-20 overflow-y-auto overscroll-contain bg-foreground/30 p-3 backdrop-blur-sm sm:p-4">
          <div className="panel mx-auto my-2 w-full max-w-2xl p-4 sm:my-4 sm:p-6 md:p-8 animate-in fade-in zoom-in-95">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs sm:tracking-[0.2em]">
              De la computación ubicua al IoT
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-4xl">¿Qué tan ubicua es esta casa?</h2>
            <blockquote className="mt-3 border-l-4 border-accent pl-3 text-xs italic text-muted-foreground sm:mt-4 sm:pl-4 sm:text-sm">
              "Las tecnologías más profundas son las que desaparecen." — Mark Weiser
            </blockquote>
            <ol className="mt-4 space-y-2 text-sm sm:mt-5 sm:space-y-2.5">
              <li className="flex gap-3"><N>1</N><span>Mira la casa desde arriba: Sala, Cocina, Dormitorio y Estudio.</span></li>
              <li className="flex gap-3"><N>2</N><span>Pasa el cursor o toca un objeto para ver su nombre.</span></li>
              <li className="flex gap-3"><N>3</N><span>Marca los de <b>computación ubicua</b>: conectados, con sensores y conscientes del contexto.</span></li>
              <li className="flex gap-3"><N>4</N><span>Cuidado: hay aparatos electrónicos que parecen inteligentes pero no lo son.</span></li>
              <li className="flex gap-3"><N>5</N><span>Al terminar recibes tu nota de <b>0 a 5</b>: cada error resta un acierto.</span></li>
            </ol>
            <form className="mt-5 sm:mt-6" onSubmit={(event) => { event.preventDefault(); dispatch({ type: "start", student: name }); }}>
              <label htmlFor="student-name" className="text-sm font-semibold">Nombre del estudiante</label>
              <Input id="student-name" name="student" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Escribe tu nombre completo" className="mt-2 h-11 bg-background text-base" />
              <Button type="submit" disabled={!name.trim()} className="mt-3 h-11 w-full text-base font-semibold sm:h-12">Comenzar a jugar</Button>
            </form>
            <div className="mt-4 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground sm:mt-5 sm:pt-4 sm:text-xs">
              <p className="font-semibold text-foreground">Desarrollado por</p>
              <p className="mt-1">{CREDITS.autores.join("; ")}.</p>
              <p className="mt-3">Para la evaluación del tema de computación básica en {CREDITS.asignatura} · {CREDITS.grupo}, dirigida por la profesora {CREDITS.docente} para la {CREDITS.universidad}.</p>
              <p className="mt-2">{CREDITS.departamento} · {CREDITS.facultad}</p>
            </div>
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <div className="absolute inset-0 z-20 overflow-y-auto overscroll-contain bg-background p-3 sm:flex sm:items-center sm:justify-center sm:p-4">
          <div className="panel mx-auto flex w-full max-w-3xl flex-col p-4 sm:max-h-[90dvh] sm:p-6 md:p-8 animate-in fade-in zoom-in-95">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs sm:tracking-[0.2em]">Evaluación finalizada</p>
                <h2 className="my-1 break-words text-xl font-semibold sm:my-2 sm:text-2xl">{student}</h2>
                <p className="font-display text-5xl font-semibold leading-none sm:text-7xl">
                  {result.nota.toFixed(1)}<span className="text-2xl text-muted-foreground sm:text-3xl"> / 5.0</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">{veredicto(result.nota)}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Aciertos" v={`${result.aciertos}/${result.totalUbicuos}`} cls="text-success" />
                <Stat label="Errores" v={result.errores} cls="text-destructive" />
                <Stat label="Omitidos" v={result.omitidos} cls="text-muted-foreground" />
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground sm:text-xs">Nota = 5 × (aciertos − errores) ÷ {result.totalUbicuos} dispositivos ubicuos.</p>
            <div className="mt-4 max-h-[45dvh] flex-1 space-y-2 overflow-y-auto pr-1 sm:mt-5 sm:max-h-none">
              {DEVICES.map((d) => {
                const m = selected.has(d.id);
                const ok = m === d.ubicuo;
                return (
                  <div key={d.id} className={`rounded-xl border p-2.5 sm:p-3 ${ok ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
                      <p className="text-sm font-semibold sm:text-base">
                        <span className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                          {ok ? "Bien" : "Mal"}
                        </span>
                        {d.nombre} <span className="text-xs font-normal text-muted-foreground">· {d.cuarto}</span>
                      </p>
                      <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:text-xs ${d.ubicuo ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                        {d.ubicuo ? "Ubicuo" : "No ubicuo"}{m ? " · lo marcaste" : ""}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{d.porque}</p>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 border-t border-border pt-3 text-center text-xs text-muted-foreground sm:mt-5 sm:pt-4 sm:text-sm">
              Calificación definitiva · La casa se ha cerrado y tus respuestas no pueden modificarse.
            </p>
          </div>
        </div>
      )}

      {credits && <CreditsPanel onClose={() => setCredits(false)} />}
    </main>
  );
}

function N({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {children}
    </span>
  );
}

function Stat({ label, v, cls }: { label: string; v: string | number; cls: string }) {
  return (
    <div className="rounded-xl bg-muted px-2.5 py-2 sm:px-4">
      <p className={`font-display text-lg font-semibold sm:text-2xl ${cls}`}>{v}</p>
      <p className="text-[10px] text-muted-foreground sm:text-xs">{label}</p>
    </div>
  );
}

function veredicto(n: number) {
  if (n >= 4.5) return "¡Excelente! Dominas la computación ubicua.";
  if (n >= 3.5) return "Muy bien, solo unos detalles por pulir.";
  if (n >= 3) return "Aprobado. Repasa las características: conectividad, sensores y contexto.";
  return "Hay que repasar. Revisa la explicación de cada objeto abajo.";
}
