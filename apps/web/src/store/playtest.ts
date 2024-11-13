/**
 * Local playtest telemetry for ?playtest=1 mode (M15 MUST 4).
 * Strictly local to localStorage. NEVER sends data over network.
 * Zero player free text is collected or stored.
 */

export interface BigIdeaAnswerRecord {
  readonly checkId: string;
  readonly correctFirstTry: boolean;
  readonly timestamp: number;
}

export interface PlaytestTelemetry {
  readonly sessionStartedAt: number;
  readonly timeToFirstDecisionMs?: number;
  readonly retriesCount: number;
  readonly bigIdeaAnswers: Record<string, BigIdeaAnswerRecord>;
}

const STORAGE_KEY = "sol_keeper_playtest_telemetry";

function getStorage(): Storage | undefined {
  if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  if (typeof globalThis !== "undefined" && globalThis.localStorage) return globalThis.localStorage;
  return undefined;
}

function getLocationSearch(): string {
  if (typeof window !== "undefined" && window.location) return window.location.search ?? "";
  const g = globalThis as { location?: { search?: string } };
  if (g.location?.search !== undefined) return g.location.search;
  return "";
}

export function isPlaytestActive(): boolean {
  return new URLSearchParams(getLocationSearch()).get("playtest") === "1";
}

export function loadPlaytestTelemetry(): PlaytestTelemetry {
  const storage = getStorage();
  if (!storage) {
    return {
      sessionStartedAt: Date.now(),
      retriesCount: 0,
      bigIdeaAnswers: {},
    };
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlaytestTelemetry>;
      return {
        sessionStartedAt: parsed.sessionStartedAt ?? Date.now(),
        ...(parsed.timeToFirstDecisionMs !== undefined
          ? { timeToFirstDecisionMs: parsed.timeToFirstDecisionMs }
          : {}),
        retriesCount: parsed.retriesCount ?? 0,
        bigIdeaAnswers: parsed.bigIdeaAnswers ?? {},
      };
    }
  } catch {
    // Ignore JSON parsing errors
  }

  const initial: PlaytestTelemetry = {
    sessionStartedAt: Date.now(),
    retriesCount: 0,
    bigIdeaAnswers: {},
  };
  savePlaytestTelemetry(initial);
  return initial;
}

export function savePlaytestTelemetry(data: PlaytestTelemetry): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

/**
 * Record player's first decision time (in milliseconds).
 */
export function recordFirstDecision(): void {
  if (!isPlaytestActive()) return;
  const current = loadPlaytestTelemetry();
  if (current.timeToFirstDecisionMs === undefined) {
    const updated: PlaytestTelemetry = {
      ...current,
      timeToFirstDecisionMs: Math.max(0, Date.now() - current.sessionStartedAt),
    };
    savePlaytestTelemetry(updated);
  }
}

/**
 * Increment mission retries / restart counter.
 */
export function recordRetry(): void {
  if (!isPlaytestActive()) return;
  const current = loadPlaytestTelemetry();
  const updated: PlaytestTelemetry = {
    ...current,
    retriesCount: current.retriesCount + 1,
  };
  savePlaytestTelemetry(updated);
}

/**
 * Record a Big Idea check answer.
 */
export function recordBigIdeaAnswer(checkId: string, isCorrect: boolean): void {
  if (!isPlaytestActive()) return;
  const current = loadPlaytestTelemetry();
  const existing = current.bigIdeaAnswers[checkId];

  // If already answered, do not overwrite the first-try outcome
  if (existing) return;

  const updated: PlaytestTelemetry = {
    ...current,
    bigIdeaAnswers: {
      ...current.bigIdeaAnswers,
      [checkId]: {
        checkId,
        correctFirstTry: isCorrect,
        timestamp: Date.now(),
      },
    },
  };
  savePlaytestTelemetry(updated);
}

/**
 * Exports current playtest telemetry as a downloadable JSON blob.
 */
export function exportPlaytestJson(): string {
  const current = loadPlaytestTelemetry();
  return JSON.stringify(current, null, 2);
}
