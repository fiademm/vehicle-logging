import { commandPatterns, vehicleTypes } from '../config/voiceCommands';
import type { CommandIntent } from '../config/voiceCommands';

export interface Command {
  intent: CommandIntent;
  entities: {
    vehicle?: string;
  };
}

class CommandParserService {
  public parse(transcript: string): Command | null {
    const lowerCaseTranscript = transcript.toLowerCase().trim();

    for (const pattern of commandPatterns) {
      const match = lowerCaseTranscript.match(pattern.pattern);

      if (match) {
        const command: Command = {
          intent: pattern.intent as CommandIntent,
          entities: {},
        };

        if (pattern.entity && match[1]) {
          const vehicle = this.findVehicle(match[1]);
          if (vehicle) {
            command.entities.vehicle = vehicle;
            return command;
          }
        } else if (!pattern.entity) {
          return command;
        }
      }
    }

    return { intent: 'unknown', entities: {} };
  }

  private findVehicle(spokenVehicle: string): string | undefined {
    const lowerSpokenVehicle = spokenVehicle.trim();
    if (vehicleTypes.includes(lowerSpokenVehicle)) {
      return lowerSpokenVehicle;
    }
    const found = vehicleTypes.find(v => lowerSpokenVehicle.includes(v));
    return found;
  }
}

export const commandParserService = new CommandParserService();