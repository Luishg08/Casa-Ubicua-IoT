import { createFileRoute } from "@tanstack/react-router";
import { useReducer, useState } from "react";
import HouseScene from "@/components/HouseScene";
import ShopScene from "@/components/ShopScene";
import { DEVICES } from "@/game/devices";
import { evaluationReducer, initialEvaluation } from "@/game/evaluation";
import { SHOP_ROUNDS } from "@/game/shop";
import { promedioNotas } from "@/game/shop-scoring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CREDITS } from "@/game/credits";
import CreditsPanel from "@/components/CreditsPanel";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Casa Ubicua — Juego de computación ubicua | Fundamentos de IoT" },
      { name: "description", content: "Explora una casa en 3D e identifica dispositivos ubicuos; luego atiende la tienda eligiendo el aparato correcto. Dos notas de 0 a 5." },
      { property: "og:title", content: "Casa Ubicua — Juego de Fundamentos de IoT" },
      { property: "og:description", content: "Nivel 1: marca lo ubicuo en la casa. Nivel 2: atiende clientes en la tienda. Dos calificaciones." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

function Game() {
  const [state, dispatch] = useReducer(evaluationReducer, undefined, initialEvaluation);
  const { phase, selected, result, student, shopRound, shopPending, shopResult } = state;
  const [credits, setCredits] = useState(false);
  const [name, setName] = useState("");
  const toggle = (id: string) => dispatch({ type: "toggle", id });
  const finish = () => dispatch({ type: "grade" });
  const round = SHOP_ROUNDS[shopRound];
  const inShop = phase === "shop-intro" || phase === "shop";
  const showHouse = phase === "intro" || phase === "play";

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      {showHouse && <HouseScene selected={selected} onToggle={toggle} locked={phase !== "play"} />}
      {inShop && round && (
        <ShopScene
          band={phase === "shop"}
          round={round}
          locked={phase !== "shop" || shopPending !== null}
          choiceId={shopPending?.choiceId ?? null}
          onChoose={(optionId) => dispatch({ type: "shopChoose", optionId })}
        />
      )}

      {/* Fondo móvil solo bajo la franja 3D (no la tapa) */}
      {phase === "shop" && (
        <div className="absolute inset-x-0 bottom-0 top-[min(42dvh,20rem)] z-0 bg-background sm:hidden" aria-hidden />
      )}

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-2 sm:gap-3 sm:p-4 md:p-6">
        <div className="panel pointer-events-auto max-w-[58%] px-3 py-2 sm:max-w-none sm:px-5 sm:py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs sm:tracking-[0.2em]">
            Fundamentos de IoT · Grupo 1
          </p>
          <h1 className="text-lg font-semibold leading-tight sm:text-2xl md:text-3xl">
            {inShop ? "Tienda Ubicua" : "Casa Ubicua"}
          </h1>
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
                <span className="sm:hidden">Nivel 2 →</span>
                <span className="hidden sm:inline">Terminar casa · Nivel 2</span>
              </Button>
            </div>
          )}
          {phase === "shop" && (
            <div className="panel px-2.5 py-1.5 text-left sm:px-5 sm:py-3 sm:text-right">
              <p className="truncate text-[10px] text-muted-foreground sm:max-w-40 sm:text-xs" title={student}>{student}</p>
              <p className="font-display text-base font-semibold sm:text-xl">
                {shopRound + 1}/{SHOP_ROUNDS.length}
              </p>
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

      {phase === "shop" && round && !shopPending && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex max-h-[58dvh] flex-col p-0 sm:max-h-none sm:p-4">
          <div className="panel pointer-events-auto mx-auto flex w-full max-w-3xl min-h-0 flex-col rounded-b-none border-b-0 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:rounded-xl sm:border sm:p-4 sm:pb-4">
            <p className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs">
              Cliente · {round.cliente}
            </p>
            <p className="mt-1 max-h-[4.5rem] overflow-y-auto text-[13px] leading-snug sm:max-h-none sm:text-base">
              “{round.pedido}”
            </p>
            <div className="mt-3 grid min-h-0 grid-cols-2 gap-2 overflow-y-auto">
              {round.opciones.map((opt) => (
                <Button
                  key={opt.id}
                  variant="outline"
                  className="h-auto min-h-11 justify-start whitespace-normal px-2.5 py-2 text-left text-xs leading-snug sm:min-h-0 sm:px-3 sm:py-2.5 sm:text-sm"
                  onClick={() => dispatch({ type: "shopChoose", optionId: opt.id })}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            <p className="mt-2 hidden text-[11px] text-muted-foreground sm:block sm:text-xs">
              Elige en la vitrina o en los botones · El cliente no dijo el nombre del aparato.
            </p>
            <p className="mt-2 text-[10px] text-muted-foreground sm:hidden">
              Toca un botón o un objeto de la vitrina.
            </p>
          </div>
        </div>
      )}

      {phase === "shop" && round && shopPending && (
        <div className="absolute inset-0 z-20 flex items-end justify-center bg-foreground/25 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
          <div className="panel w-full max-w-lg rounded-b-none border-b-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-xl sm:border sm:p-6 animate-in fade-in zoom-in-95">
            <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${shopPending.ok ? "text-success" : "text-destructive"}`}>
              {shopPending.ok ? "Entrega correcta" : "Entrega incorrecta"}
            </p>
            <h3 className="mt-1 break-words font-display text-xl font-semibold sm:text-2xl">
              {round.opciones.find((o) => o.id === shopPending.choiceId)?.label}
            </h3>
            <p className="mt-2 max-h-[30dvh] overflow-y-auto text-sm text-muted-foreground sm:max-h-none">{round.porque}</p>
            <Button className="mt-4 h-11 w-full text-base font-semibold" onClick={() => dispatch({ type: "shopNext" })}>
              {shopRound + 1 >= SHOP_ROUNDS.length ? "Ver calificaciones" : "Siguiente cliente"}
            </Button>
          </div>
        </div>
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
              <li className="flex gap-3"><N>1</N><span><b>Nivel 1 · Casa:</b> marca los objetos de computación ubicua (conectados, sensores, contexto).</span></li>
              <li className="flex gap-3"><N>2</N><span>Cuidado: hay electrónicos que parecen inteligentes pero no lo son.</span></li>
              <li className="flex gap-3"><N>3</N><span><b>Nivel 2 · Tienda:</b> 5 clientes describen sin nombrar; tú entregas el dispositivo correcto.</span></li>
              <li className="flex gap-3"><N>4</N><span>Recibes <b>dos notas de 0 a 5</b> (casa y tienda) y un promedio.</span></li>
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

      {phase === "shop-intro" && result && (
        <div className="absolute inset-0 z-20 overflow-y-auto overscroll-contain bg-foreground/35 p-3 backdrop-blur-sm sm:p-4">
          <div className="panel mx-auto my-2 w-full max-w-xl p-4 sm:my-8 sm:p-6 md:p-8 animate-in fade-in zoom-in-95">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs sm:tracking-[0.2em]">
              Nivel 1 cerrado · Casa
            </p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Nota parcial: {result.nota.toFixed(1)} / 5.0</h2>
            <p className="mt-1 text-sm text-muted-foreground">{veredictoCasa(result.nota)}</p>
            <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3 sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Nivel 2 · Tienda Ubicua</p>
              <p className="mt-2 text-sm leading-relaxed">
                Atiendes el mostrador. Llegan <b>5 clientes</b> que describen lo que necesitan <b>sin decir el nombre</b> del aparato.
                Elige en la vitrina 3D (o en los botones) qué entregar. A veces lo correcto <b>no</b> es lo más “smart”.
              </p>
            </div>
            <Button className="mt-5 h-11 w-full text-base font-semibold sm:h-12" onClick={() => dispatch({ type: "enterShop" })}>
              Abrir la tienda
            </Button>
          </div>
        </div>
      )}

      {phase === "result" && result && shopResult && (
        <div className="absolute inset-0 z-20 overflow-y-auto overscroll-contain bg-background p-4 sm:flex sm:items-center sm:justify-center sm:p-6">
          <div className="panel mx-auto flex w-full max-w-3xl flex-col overflow-hidden p-5 sm:max-h-[90dvh] sm:p-7 md:p-9 animate-in fade-in zoom-in-95">
            <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs sm:tracking-[0.2em]">Evaluación finalizada</p>
                <h2 className="my-1 break-words text-xl font-semibold sm:my-2 sm:text-2xl">{student}</h2>
                <p className="font-display text-5xl font-semibold leading-none sm:text-7xl">
                  {promedioNotas(result.nota, shopResult.nota).toFixed(1)}
                  <span className="text-2xl text-muted-foreground sm:text-3xl"> / 5.0</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Promedio · {veredictoFinal(promedioNotas(result.nota, shopResult.nota))}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <Stat label="Casa (N1)" v={result.nota.toFixed(1)} cls="text-primary" />
                <Stat label="Tienda (N2)" v={shopResult.nota.toFixed(1)} cls="text-primary" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <Stat label="Aciertos casa" v={`${result.aciertos}/${result.totalUbicuos}`} cls="text-success" />
              <Stat label="Errores casa" v={result.errores} cls="text-destructive" />
              <Stat label="Tienda" v={`${shopResult.aciertos}/${shopResult.total}`} cls="text-success" />
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              Casa = 5 × (aciertos − errores) ÷ ubicuos · Tienda = 1 punto por cliente correcto · Promedio = media de ambas.
            </p>

            <Tabs defaultValue="casa" className="mt-6 flex min-h-0 w-full min-w-0 flex-1 flex-col">
              <TabsList className="grid h-11 w-full shrink-0 grid-cols-2">
                <TabsTrigger value="casa" className="text-xs sm:text-sm">Nivel 1 · Casa</TabsTrigger>
                <TabsTrigger value="tienda" className="text-xs sm:text-sm">Nivel 2 · Tienda</TabsTrigger>
              </TabsList>

              <TabsContent value="casa" className="mt-4 min-h-0 w-full min-w-0 flex-1 overflow-hidden outline-none">
                <div className="max-h-[42dvh] space-y-3 overflow-x-hidden overflow-y-auto overscroll-contain px-0.5 sm:max-h-[38dvh]">
                  {DEVICES.map((d) => {
                    const m = selected.has(d.id);
                    const ok = m === d.ubicuo;
                    return (
                      <div key={d.id} className={`w-full min-w-0 rounded-xl border p-3.5 sm:p-4 ${ok ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
                        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                          <div className="flex min-w-0 items-start gap-2">
                            <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                              {ok ? "Bien" : "Mal"}
                            </span>
                            <p className="min-w-0 break-words text-sm font-semibold sm:text-base">
                              {d.nombre}{" "}
                              <span className="text-xs font-normal text-muted-foreground">· {d.cuarto}</span>
                            </p>
                          </div>
                          <span className={`w-fit shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:text-xs ${d.ubicuo ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>
                            {d.ubicuo ? "Ubicuo" : "No ubicuo"}{m ? " · lo marcaste" : ""}
                          </span>
                        </div>
                        <p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground sm:text-sm">{d.porque}</p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="tienda" className="mt-4 min-h-0 w-full min-w-0 flex-1 overflow-hidden outline-none">
                <div className="max-h-[42dvh] space-y-3 overflow-x-hidden overflow-y-auto overscroll-contain px-0.5 sm:max-h-[38dvh]">
                  {SHOP_ROUNDS.map((r, i) => {
                    const det = shopResult.detalle[i];
                    const ok = det?.ok;
                    const elegida = r.opciones.find((o) => o.id === det?.elegida)?.label ?? "—";
                    return (
                      <div key={r.id} className={`w-full min-w-0 rounded-xl border p-3.5 sm:p-4 ${ok ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
                        <div className="flex min-w-0 items-start gap-2">
                          <span className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                            {ok ? "Bien" : "Mal"}
                          </span>
                          <p className="min-w-0 break-words text-sm font-semibold sm:text-base">{r.cliente}</p>
                        </div>
                        <p className="mt-2 break-words text-xs text-muted-foreground">Entregaste: {elegida}</p>
                        <p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground sm:text-sm">{r.porque}</p>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>

            <p className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground sm:text-sm">
              Calificación definitiva · Casa y tienda cerradas; tus respuestas no pueden modificarse.
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
    <div className="rounded-xl bg-muted px-3 py-2.5 sm:px-4 sm:py-3">
      <p className={`font-display text-lg font-semibold sm:text-2xl ${cls}`}>{v}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">{label}</p>
    </div>
  );
}

function veredictoCasa(n: number) {
  if (n >= 4.5) return "Excelente lectura de la casa.";
  if (n >= 3.5) return "Muy bien en la casa; ahora a la tienda.";
  if (n >= 3) return "Aprobado en la casa. En la tienda aplica el mismo criterio.";
  return "La casa costó. En la tienda piensa en conectividad, sensores y contexto.";
}

function veredictoFinal(n: number) {
  if (n >= 4.5) return "¡Excelente! Dominas la computación ubicua.";
  if (n >= 3.5) return "Muy bien, solo unos detalles por pulir.";
  if (n >= 3) return "Aprobado. Repasa las características: conectividad, sensores y contexto.";
  return "Hay que repasar. Revisa la explicación de cada entrega abajo.";
}
