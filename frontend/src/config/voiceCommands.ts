export type CommandIntent = 'entry' | 'exit' | 'query' | 'delete' | 'repeat' | 'unknown';

export interface CommandPattern {
  pattern: RegExp;
  intent: CommandIntent;
  entity?: 'vehicle';
}

export const vehicleTypes: string[] = [
  "ambulance", "police", "army", "fire", "guest", "minibus", "uber", "taxi", "bike"
];

export const commandPatterns: CommandPattern[] = [
  // Entry commands
  { pattern: /log (.*) in/, intent: 'entry', entity: 'vehicle' },
  { pattern: /(.*) entry/, intent: 'entry', entity: 'vehicle' },
  { pattern: /(.*) coming in/, intent: 'entry', entity: 'vehicle' },

  // Exit commands
  { pattern: /log (.*) out/, intent: 'exit', entity: 'vehicle' },
  { pattern: /(.*) exit/, intent: 'exit', entity: 'vehicle' },
  { pattern: /(.*) leaving/, intent: 'exit', entity: 'vehicle' },

  // Query commands
  { pattern: /show current vehicles/, intent: 'query' },
  { pattern: /what vehicles are here/, intent: 'query' },
  { pattern: /current status/, intent: 'query' },

  // Delete commands
  { pattern: /clear last entry/, intent: 'delete' },
  { pattern: /delete last one/, intent: 'delete' },
  { pattern: /remove last entry/, intent: 'delete' },

  // Repeat commands
  { pattern: /repeat last action/, intent: 'repeat' },
  { pattern: /say again/, intent: 'repeat' },
  { pattern: /repeat/, intent: 'repeat' },
];