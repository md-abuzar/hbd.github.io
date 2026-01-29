
export enum AppState {
  COUNTDOWN = 'COUNTDOWN',
  ENVELOPE_READY = 'ENVELOPE_READY',
  ENVELOPE_OPENING = 'ENVELOPE_OPENING',
  CARD_VIEW = 'CARD_VIEW'
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}
