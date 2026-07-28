export const AUTOMATION_EVENT_TYPES = [
  "feedback.accepted",
  "task.started",
  "validation.completed",
  "change.merged",
  "release.published",
] as const;

export type AutomationEventType = (typeof AUTOMATION_EVENT_TYPES)[number];

export interface AutomationEvent {
  readonly type: AutomationEventType;
  readonly projectId: string;
  readonly occurredAt: string;
  readonly correlationId?: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

/**
 * The core kit depends on this port, never on a concrete agent runtime.
 * Agent Runtime or another orchestrator can be attached in a separate adapter.
 */
export interface AutomationPort {
  emit(event: AutomationEvent): Promise<void>;
}

export class NoopAutomationPort implements AutomationPort {
  async emit(_event: AutomationEvent): Promise<void> {
    await Promise.resolve();
  }
}

export class RecordingAutomationPort implements AutomationPort {
  readonly events: AutomationEvent[] = [];

  async emit(event: AutomationEvent): Promise<void> {
    this.events.push(event);
    await Promise.resolve();
  }
}
