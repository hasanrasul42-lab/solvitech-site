import { END, GAP, ORDER, REWIND, SECONDS, START, type Mechanism, type Phase, type Progress } from "./choreography";

type Step =
  | { kind: "tween"; phases: Phase[]; to: 0 | 1; seconds: number }
  | { kind: "wait"; seconds: number };

/** Idle drift after the sequence settles, then stillness (seconds). */
export const IDLE_SECONDS = 16;

/**
 * Plays the choreography. Lives outside React so the render loop can read
 * and advance it every frame without re-rendering; the UI subscribes to the
 * (rare) changes of which phase is running.
 */
export class Director {
  p: Progress = { ...START };
  private queue: Step[] = [];
  private wait = 0;
  /** Seconds of idle drift left; > 0 only after a full sequence settles. */
  idle = 0;
  idleClock = 0;
  /** Phase currently moving forward, for captions and highlights. */
  active: Phase | null = null;
  /** Capability the visitor is hovering/focusing (lights its module). */
  highlight: Mechanism | null = null;
  pointer = { x: 0, y: 0 };
  /** Eased pointer (parallax) and eased module highlights, 0..1. */
  tilt = { x: 0, y: 0 };
  hl: Record<Mechanism, number> = { intel: 0, auto: 0, sys: 0 };
  visible = true;
  private listeners = new Set<() => void>();
  private version = 0;
  /** Set by the scene so the director can request frames while it works. */
  wake: () => void = () => {};

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getVersion = () => this.version;
  private emit() {
    this.version++;
    this.listeners.forEach((fn) => fn());
  }

  setWake(fn: () => void) {
    this.wake = fn;
  }
  /** Renderer statistics for the dev panel / tests. */
  inspect: () => unknown = () => null;
  setInspect(fn: () => unknown) {
    this.inspect = fn;
  }
  /** Frames rendered so far (dev/tests). */
  frames = 0;
  setHighlight(m: Mechanism | null) {
    this.highlight = m;
    this.wake();
  }
  setPointer(x: number, y: number) {
    this.pointer = { x, y };
    this.wake();
  }
  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.wake();
  }

  /** One rendered frame: choreography, highlights, parallax. True while anything moves. */
  frame(dt: number) {
    this.frames++;
    let moving = this.step(dt);
    const k = 1 - Math.exp(-dt * 6);
    for (const m of ["intel", "auto", "sys"] as Mechanism[]) {
      const target = this.highlight === m || this.active === m ? 1 : 0;
      this.hl[m] += (target - this.hl[m]) * k;
      if (Math.abs(target - this.hl[m]) > 0.002) moving = true;
      else this.hl[m] = target;
    }
    const kp = 1 - Math.exp(-dt * 3.2);
    this.tilt.x += (this.pointer.x - this.tilt.x) * kp;
    this.tilt.y += (this.pointer.y - this.tilt.y) * kp;
    if (Math.abs(this.pointer.x - this.tilt.x) + Math.abs(this.pointer.y - this.tilt.y) > 0.0015) moving = true;
    return moving;
  }

  get busy() {
    return this.queue.length > 0 || this.wait > 0;
  }

  private run(steps: Step[]) {
    this.queue = steps;
    this.wait = 0;
    this.idle = 0;
    this.setActive(null);
    this.wake();
  }
  private rewind(phases: Phase[]): Step[] {
    const furthest = Math.max(...phases.map((ph) => this.p[ph]));
    return furthest > 0 ? [{ kind: "tween", phases, to: 0, seconds: REWIND * Math.max(0.6, furthest) }, { kind: "wait", seconds: 0.3 }] : [];
  }

  /** The full sequence from the separated state. */
  playAll() {
    const steps: Step[] = [...this.rewind(ORDER)];
    ORDER.forEach((ph, i) => {
      if (i > 0) steps.push({ kind: "wait", seconds: GAP });
      steps.push({ kind: "tween", phases: [ph], to: 1, seconds: SECONDS[ph] });
    });
    this.run(steps);
  }
  /** Replay one mechanism in place (wherever the rest of the sculpture is). */
  playMechanism(m: Mechanism) {
    this.run([...this.rewind([m]), { kind: "tween", phases: [m], to: 1, seconds: SECONDS[m] }]);
  }
  /** Back to the separated starting state, then hold. */
  reset() {
    this.run(this.rewind(ORDER));
  }
  /** Jump to an exact state (dev controls, reduced motion, tests). */
  set(p: Partial<Progress>) {
    this.queue = [];
    this.wait = 0;
    this.idle = 0;
    this.p = { ...this.p, ...p };
    this.setActive(null);
    this.wake();
  }
  /** Dev: show the state just before a mechanism, then play it. */
  playFrom(m: Mechanism) {
    const before: Progress = { ...START };
    for (const ph of ORDER) {
      if (ph === m) break;
      before[ph] = 1;
    }
    this.set(before);
    this.run([{ kind: "wait", seconds: 0.4 }, { kind: "tween", phases: [m], to: 1, seconds: SECONDS[m] }]);
  }

  private setActive(a: Phase | null) {
    if (this.active === a) return;
    this.active = a;
    this.emit();
  }

  /** Advance by dt seconds; returns true while anything is still moving. */
  step(dt: number) {
    if (this.wait > 0) {
      this.wait -= dt;
      return true;
    }
    const s = this.queue[0];
    if (!s) {
      if (this.idle > 0) {
        this.idle -= dt;
        this.idleClock += dt;
        return true;
      }
      return false;
    }
    if (s.kind === "wait") {
      this.queue.shift();
      this.wait = s.seconds;
      return true;
    }
    // A single mechanism stays 'active' while it rewinds for a replay.
    this.setActive(s.to === 1 || s.phases.length === 1 ? s.phases[0] : null);
    let done = true;
    for (const ph of s.phases) {
      const v = this.p[ph] + (s.to === 1 ? 1 : -1) * (dt / s.seconds);
      this.p[ph] = s.to === 1 ? Math.min(1, v) : Math.max(0, v);
      if (this.p[ph] !== s.to) done = false;
    }
    if (done) {
      this.queue.shift();
      if (this.queue.length === 0) {
        this.setActive(null);
        if (ORDER.every((ph) => this.p[ph] === END[ph])) {
          this.idle = IDLE_SECONDS;
          this.idleClock = 0;
        }
      }
    }
    return true;
  }
}
