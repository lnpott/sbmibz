// Sistema de versionamento baseado em timestamps
// Formato: v1.20260222.151030 (data e hora)

const STORAGE_KEY = 'app_version_info';
const BASE_VERSION = '1';

interface VersionInfo {
  major: string;
  timestamp: string;
  buildNumber: number;
  createdAt: string;
}

export const getVersion = (): string => {
  const versionInfo = getVersionInfo();
  return `v${versionInfo.major}.${versionInfo.timestamp}`;
};

export const incrementVersion = (): string => {
  // Gera timestamp atual
  const now = new Date();
  const timestamp = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') + '.' +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');

  // Obtém informações atuais
  const currentInfo = getCurrentVersionInfo();
  
  // Nova versão
  const newVersionInfo: VersionInfo = {
    major: BASE_VERSION,
    timestamp,
    buildNumber: (currentInfo?.buildNumber || 0) + 1,
    createdAt: now.toISOString()
  };

  // Salva nova versão
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVersionInfo));
  
  return getVersion();
};

export const resetVersion = (): string => {
  const now = new Date();
  const timestamp = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') + '.' +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');

  const resetVersionInfo: VersionInfo = {
    major: BASE_VERSION,
    timestamp,
    buildNumber: 0,
    createdAt: now.toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(resetVersionInfo));
  
  return getVersion();
};

const getCurrentVersionInfo = (): VersionInfo | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const getVersionInfo = () => {
  const currentInfo = getCurrentVersionInfo();
  
  // Se não existir, cria versão inicial
  if (!currentInfo) {
    return resetVersionInfo();
  }

  return {
    version: getVersion(),
    major: currentInfo.major,
    timestamp: currentInfo.timestamp,
    buildNumber: currentInfo.buildNumber,
    formatted: getVersion(),
    description: `Versão ${currentInfo.major}.${currentInfo.timestamp} (Build #${currentInfo.buildNumber})`,
    createdAt: currentInfo.createdAt
  };
};

const resetVersionInfo = () => {
  const now = new Date();
  const timestamp = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') + '.' +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');

  const initialVersionInfo: VersionInfo = {
    major: BASE_VERSION,
    timestamp,
    buildNumber: 0,
    createdAt: now.toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialVersionInfo));
  
  return {
    version: `v${BASE_VERSION}.${timestamp}`,
    major: BASE_VERSION,
    timestamp,
    buildNumber: 0,
    formatted: `v${BASE_VERSION}.${timestamp}`,
    description: `Versão ${BASE_VERSION}.${timestamp} (Build #0)`,
    createdAt: now.toISOString()
  };
};
