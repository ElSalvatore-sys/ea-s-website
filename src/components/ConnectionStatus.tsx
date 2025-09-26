import React from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { WebSocketStatus } from '../lib/websocket';
import { useTranslation } from 'react-i18next';

interface ConnectionStatusProps {
  status: WebSocketStatus;
  onReconnect?: () => void;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  onReconnect,
  showDetails = false,
  compact = false,
  className = ''
}) => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: compact ? <CheckCircle className="w-4 h-4" /> : <Wifi className="w-5 h-5" />,
          text: isGerman ? 'Verbunden' : 'Connected',
          detail: isGerman ? 'Echtzeitverbindung aktiv' : 'Real-time connection active',
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          pulseColor: 'bg-green-500'
        };
      case 'connecting':
        return {
          icon: <RefreshCw className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} animate-spin`} />,
          text: isGerman ? 'Verbinde...' : 'Connecting...',
          detail: isGerman ? 'Verbindung wird hergestellt' : 'Establishing connection',
          color: 'text-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          pulseColor: 'bg-blue-500'
        };
      case 'reconnecting':
        return {
          icon: <RefreshCw className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} animate-spin`} />,
          text: isGerman ? 'Neuverbindung...' : 'Reconnecting...',
          detail: isGerman ? 'Versuche erneut zu verbinden' : 'Attempting to reconnect',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          pulseColor: 'bg-yellow-500'
        };
      case 'disconnected':
        return {
          icon: <WifiOff className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />,
          text: isGerman ? 'Getrennt' : 'Disconnected',
          detail: isGerman ? 'Keine Verbindung zum Server' : 'No connection to server',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          pulseColor: 'bg-gray-500'
        };
      case 'error':
        return {
          icon: <AlertCircle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />,
          text: isGerman ? 'Fehler' : 'Error',
          detail: isGerman ? 'Verbindungsfehler aufgetreten' : 'Connection error occurred',
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          pulseColor: 'bg-red-500'
        };
      default:
        return {
          icon: <AlertCircle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />,
          text: isGerman ? 'Unbekannt' : 'Unknown',
          detail: isGerman ? 'Status unbekannt' : 'Status unknown',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
          pulseColor: 'bg-gray-500'
        };
    }
  };

  const config = getStatusConfig();

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <div className="relative">
          <span className={config.color}>{config.icon}</span>
          {status === 'connected' && (
            <span className={`absolute -top-1 -right-1 w-2 h-2 ${config.pulseColor} rounded-full animate-pulse`} />
          )}
        </div>
        <span className={`text-sm font-medium ${config.color}`}>
          {config.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className={config.color}>{config.icon}</span>
            {status === 'connected' && (
              <span className={`absolute -top-1 -right-1 w-2 h-2 ${config.pulseColor} rounded-full animate-pulse`} />
            )}
          </div>
          <div>
            <p className={`font-medium ${config.color}`}>
              {config.text}
            </p>
            {showDetails && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {config.detail}
              </p>
            )}
          </div>
        </div>
        
        {onReconnect && (status === 'disconnected' || status === 'error') && (
          <button
            onClick={onReconnect}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            {isGerman ? 'Verbinden' : 'Connect'}
          </button>
        )}
      </div>

      {/* Connection quality indicator for connected state */}
      {status === 'connected' && showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              {isGerman ? 'Verbindungsqualität' : 'Connection Quality'}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
              <div className="w-1 h-3 bg-green-500 rounded-sm"></div>
              <span className="ml-1 text-green-600 dark:text-green-400 font-medium">
                {isGerman ? 'Ausgezeichnet' : 'Excellent'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Retry information for reconnecting state */}
      {status === 'reconnecting' && showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {isGerman 
              ? 'Automatische Wiederverbindung läuft...' 
              : 'Automatic reconnection in progress...'}
          </div>
        </div>
      )}

      {/* Error details for error state */}
      {status === 'error' && showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-red-600 dark:text-red-400">
            {isGerman 
              ? 'Bitte überprüfen Sie Ihre Internetverbindung oder kontaktieren Sie den Support.' 
              : 'Please check your internet connection or contact support.'}
          </div>
        </div>
      )}
    </div>
  );
};

// Minimal connection indicator for headers/navigation
export const ConnectionIndicator: React.FC<{ status: WebSocketStatus }> = ({ status }) => {
  const getIndicatorColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
      case 'reconnecting':
        return 'bg-yellow-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="relative">
      <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
      {status === 'connected' && (
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
      )}
    </div>
  );
};

export default ConnectionStatus;