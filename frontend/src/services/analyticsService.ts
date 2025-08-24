
// src/services/analyticsService.ts

export interface VoiceCommandLog {
  id: string;
  timestamp: number;
  command: string;
  success: boolean;
  processingTime: number; // in milliseconds
  recognizedText: string;
}

class AnalyticsService {
  private commandLogs: VoiceCommandLog[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    try {
      const serializedLogs = JSON.stringify(this.commandLogs);
      localStorage.setItem('voiceCommandLogs', serializedLogs);
    } catch (error) {
      console.error('Could not save analytics logs to local storage:', error);
    }
  }

  private loadFromLocalStorage() {
    try {
      const serializedLogs = localStorage.getItem('voiceCommandLogs');
      if (serializedLogs) {
        this.commandLogs = JSON.parse(serializedLogs);
      }
    } catch (error) {
      console.error('Could not load analytics logs from local storage:', error);
    }
  }

  public trackCommand(
    recognizedText: string,
    command: string,
    success: boolean,
    processingTime: number
  ): void {
    const log: VoiceCommandLog = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      recognizedText,
      command,
      success,
      processingTime,
    };
    this.commandLogs.push(log);
    this.saveToLocalStorage();
  }

  public getCommandLogs(): VoiceCommandLog[] {
    return [...this.commandLogs];
  }

  public getAnalyticsSummary() {
    const totalCommands = this.commandLogs.length;
    if (totalCommands === 0) {
      return {
        totalCommands: 0,
        successRate: 0,
        averageProcessingTime: 0,
        commandUsage: {},
      };
    }

    const successfulCommands = this.commandLogs.filter(log => log.success).length;
    const successRate = (successfulCommands / totalCommands) * 100;

    const totalProcessingTime = this.commandLogs.reduce((sum, log) => sum + log.processingTime, 0);
    const averageProcessingTime = totalProcessingTime / totalCommands;

    const commandUsage = this.commandLogs.reduce((acc, log) => {
      const key = log.success ? log.command : 'failed';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCommands,
      successRate: parseFloat(successRate.toFixed(1)),
      averageProcessingTime: parseFloat(averageProcessingTime.toFixed(2)),
      commandUsage,
    };
  }

  public clearLogs() {
    this.commandLogs = [];
    this.saveToLocalStorage();
  }
}

const analyticsService = new AnalyticsService();
export default analyticsService;