import { useCallback } from 'react';
import { incrementVersion, resetVersion, getVersionInfo } from '@/lib/version';

export const useVersionTracker = () => {
  const incrementVersionOnAction = useCallback((action: string) => {
    // Incrementa versão para ações importantes
    const importantActions = [
      'create_rt',
      'update_status',
      'add_agente',
      'update_agente',
      'add_empresa',
      'update_empresa',
      'add_local',
      'update_local',
      'add_pessoa',
      'update_pessoa'
    ];

    if (importantActions.some(important => action.includes(important))) {
      const newVersion = incrementVersion();
      console.log(`Versão incrementada para: ${newVersion} (ação: ${action})`);
      return newVersion;
    }
    
    return getVersionInfo().formatted;
  }, []);

  const manualIncrement = useCallback(() => {
    const newVersion = incrementVersion();
    console.log(`Versão incrementada manualmente para: ${newVersion}`);
    return newVersion;
  }, []);

  const resetVersion = useCallback(() => {
    const newVersion = resetVersion();
    console.log(`Versão resetada para: ${newVersion}`);
    return newVersion;
  }, []);

  return {
    incrementVersionOnAction,
    manualIncrement,
    resetVersion,
    currentVersion: getVersionInfo().formatted,
    versionInfo: getVersionInfo()
  };
};
