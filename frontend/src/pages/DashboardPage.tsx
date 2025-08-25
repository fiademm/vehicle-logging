import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import VehicleTypeSelector from '../components/dashboard/VehicleTypeSelector';
import VehicleStats from '../components/dashboard/VehicleStats';
import CurrentVehicles from '../components/dashboard/CurrentVehicles';
import RecentLogs from '../components/dashboard/RecentLogs';
import VoiceControl from '../components/dashboard/VoiceControl';
import VoiceSettings from '../components/dashboard/VoiceSettings';
import Modal from '../components/general/Modal';
import { FiSettings } from 'react-icons/fi';
import { speechSynthesisService } from '../services/speechSynthesisService';
import { commandParserService } from '../services/commandParserService';
import { voiceService } from '../services/voiceService';
import api from '../services/api';
import { VEHICLE_ENDPOINTS } from '../api/endpoints';
import analyticsService from '../services/analyticsService';
import { useResponsive } from '../hooks/useResponsive';
import useDeviceOrientation from '../hooks/useDeviceOrientation';
import useVoiceSettings from '../hooks/useVoiceSettings';
import type { Vehicle } from '../types/Vehicle';
import type { Log } from '../types/Log';

const WAKE_WORD = 'hey security';

const DashboardPage = (): JSX.Element => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentVehicles, setCurrentVehicles] = useState<Vehicle[]>([]);
  const [recentLogs, setRecentLogs] = useState<Log[]>([]);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const { continuousListening } = useVoiceSettings();
  const orientation = useDeviceOrientation();
  const breakpoint = useResponsive();
  const [isMobile, setIsMobile] = useState(false);
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEditLog = (log: Log) => {
    console.log('Edit log:', log);
  };

  const handleDeleteLog = (id: string) => {
    console.log('Delete log:', id);
  };

  useEffect(() => {
    setIsMobile(breakpoint === 'mobile');
  }, [breakpoint]);

  useEffect(() => {
    const eventSource = new EventSource('/api/sse');
    
    eventSource.onmessage = (event) => {
      if (event.data && event.data !== 'Connected') {
        try {
          const data = JSON.parse(event.data);
          if (data.vehicles) {
            setCurrentVehicles(data.vehicles);
          }
          if (data.logs) {
            setRecentLogs(data.logs);
          }
        } catch (error) {
          console.error("Failed to parse SSE data:", error);
        }
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      console.log('Mobile view is enabled');
    }
  }, [isMobile]);

  useEffect(() => {
    console.log(`Device orientation: ${orientation}`);
  }, [orientation]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    speechSynthesisService.speak(
      text,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      }
    );
  }, []);

  const handleVoiceCommand = useCallback(async (command: string) => {
    const startTime = performance.now();
    let success = false;
    let parsedIntent = 'unknown';

    try {
      const parsedCommand = commandParserService.parse(command);

      if (parsedCommand?.intent === 'repeat') {
        if (lastCommand) {
          speak(`Repeating the last command: ${lastCommand}`);
          await handleVoiceCommand(lastCommand);
        } else {
          speak("There is nothing to repeat.");
        }
        return;
      }
      
      if (parsedCommand) {
        setLastCommand(command);
        const { intent, entities } = parsedCommand;
        parsedIntent = intent;
        let feedbackMessage = `Command: ${intent}`;
        if (entities.vehicle) {
          feedbackMessage += `, Vehicle: ${entities.vehicle}`;
        }
        toast(feedbackMessage);
        speak(feedbackMessage);

        switch (intent) {
          case 'entry':
            if (entities.vehicle) {
              try {
                await api.post(VEHICLE_ENDPOINTS.ENTRY, { vehicleType: entities.vehicle });
                toast.success(`Vehicle entry for ${entities.vehicle} logged successfully.`);
                speak(`Entry for ${entities.vehicle} logged.`);
                success = true;
              } catch (error) {
                console.error('Error logging vehicle entry:', error);
                toast.error('Failed to log vehicle entry.');
                speak('Sorry, there was an error logging the entry.');
              }
            } else {
              toast.error('No vehicle type specified for entry.');
              speak('Please specify a vehicle type for the entry.');
            }
            break;
          case 'exit':
            if (entities.vehicle) {
              const vehicleToExit = [...currentVehicles].reverse().find((v: Vehicle) => v.type === entities.vehicle);
              if (vehicleToExit) {
                try {
                  await api.post(VEHICLE_ENDPOINTS.EXIT(Number(vehicleToExit.id)));
                  toast.success(`Vehicle exit for ${entities.vehicle} logged successfully.`);
                  speak(`Exit for ${entities.vehicle} logged.`);
                  success = true;
                } catch (error) {
                  console.error('Error logging vehicle exit:', error);
                  toast.error('Failed to log vehicle exit.');
                  speak('Sorry, there was an error logging the exit.');
                }
              } else {
                toast.error(`No ${entities.vehicle} is currently entered.`);
                speak(`I can't find a ${entities.vehicle} to exit.`);
              }
            } else {
              toast.error('No vehicle type specified for exit.');
              speak('Please specify a vehicle type for the exit.');
            }
            break;
          case 'query':
            if (currentVehicles.length > 0) {
              const vehicleList = currentVehicles.map((v: Vehicle) => v.type).join(', ');
              speak(`Currently, the following vehicles are here: ${vehicleList}`);
            } else {
              speak('There are no vehicles currently here.');
            }
            success = true;
            break;
          case 'delete':
            if (recentLogs.length > 0) {
              const lastLog = recentLogs[0] as Log;
              try {
                await api.delete(VEHICLE_ENDPOINTS.DELETE_LOG(Number(lastLog.id)));
                toast.success('Last log entry deleted successfully.');
                speak('The last log entry has been deleted.');
                success = true;
              } catch (error) {
                console.error('Error deleting last log entry:', error);
                toast.error('Failed to delete the last log entry.');
                speak('Sorry, there was an error deleting the last entry.');
              }
            } else {
              toast.error('No recent logs to delete.');
              speak('There are no recent logs to delete.');
            }
            break;
          default:
            console.log('Unknown command:', command);
            speak("Sorry, I didn't understand that command.");
            break;
        }
      } else {
        toast.error('Could not parse voice command.');
        speak("I'm having trouble understanding.");
      }
    } finally {
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      analyticsService.trackCommand(command, parsedIntent, success, processingTime);
    }
  }, [currentVehicles, recentLogs, lastCommand, speak]);

  const handleFinalCommand = useCallback(async (command: string) => {
    if (commandTimeoutRef.current) {
      clearTimeout(commandTimeoutRef.current);
      commandTimeoutRef.current = null;
    }
    setWakeWordDetected(false);
    await handleVoiceCommand(command);
  }, [handleVoiceCommand]);

  useEffect(() => {
    if (!voiceService.supported() || !continuousListening) {
      return;
    }

    const handleResult = (transcript: string, isFinal: boolean) => {
      const lowerCaseTranscript = transcript.toLowerCase();

      if (wakeWordDetected) {
        if (isFinal) {
          handleFinalCommand(lowerCaseTranscript);
        } else {
          if (commandTimeoutRef.current) {
            clearTimeout(commandTimeoutRef.current);
          }
          commandTimeoutRef.current = setTimeout(() => {
            handleFinalCommand(lowerCaseTranscript);
          }, 3000); // 3-second timeout for command finalization
        }
      } else if (lowerCaseTranscript.includes(WAKE_WORD)) {
        setWakeWordDetected(true);
        speak("I'm listening.");
        if (commandTimeoutRef.current) {
          clearTimeout(commandTimeoutRef.current);
        }
      }
    };

    voiceService.start({
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResult: handleResult,
      onError: (error) => {
        console.error('Voice recognition error:', error);
        toast.error('Voice recognition error.');
      },
    });

    return () => {
      voiceService.stop();
    };
  }, [wakeWordDetected, handleFinalCommand, speak, continuousListening]);

  return (
    <div className={`p-4 md:p-6 bg-neutralLight min-h-screen ${isMobile ? 'container-mobile' : ''} ${orientation}`}>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Dashboard</h1>
      <div className="space-y-4 md:space-y-6">
        <VehicleTypeSelector />
        <CurrentVehicles vehicles={currentVehicles} />
        <RecentLogs logs={recentLogs} onEdit={handleEditLog} onDelete={handleDeleteLog} />
        <VehicleStats logs={recentLogs} />
      </div>
      <div className="fixed bottom-4 right-4 md:bottom-10 md:right-10 flex items-center space-x-2 md:space-x-4">
        <button 
          onClick={() => setIsSettingsModalOpen(true)} 
          className="p-2 md:p-3 bg-neutralMedium rounded-full hover:bg-neutralMedium transition-colors"
          aria-label="Open voice settings"
        >
          <FiSettings className="h-5 w-5 md:h-6 md:w-6" />
        </button>
        <VoiceControl onCommand={handleVoiceCommand} isSpeaking={isSpeaking} isListening={isListening} wakeWordDetected={wakeWordDetected} />
      </div>
      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Voice Settings">
        <VoiceSettings />
      </Modal>
    </div>
  );
};

export default DashboardPage;