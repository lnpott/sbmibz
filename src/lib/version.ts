// Sistema de versionamento dinâmico
// Formato: v1.[contador de modificações com zeros à esquerda]

const STORAGE_KEY = 'version_counter';
const BASE_VERSION = '1';

export const getVersion = (): string => {
  // Obtém contador do localStorage ou inicia com 0
  const counter = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  
  // Calcula zeros necessários (mínimo 2 dígitos)
  const digits = Math.max(2, Math.min(4, counter.toString().length));
  const paddedCounter = counter.toString().padStart(digits, '0');
  
  return `v${BASE_VERSION}.${paddedCounter}beta`;
};

export const incrementVersion = (): string => {
  // Incrementa contador
  const currentCounter = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  const newCounter = currentCounter + 1;
  
  // Salva novo contador
  localStorage.setItem(STORAGE_KEY, newCounter.toString());
  
  // Retorna nova versão
  const digits = Math.max(2, Math.min(4, newCounter.toString().length));
  const paddedCounter = newCounter.toString().padStart(digits, '0');
  
  return `v${BASE_VERSION}.${paddedCounter}beta`;
};

export const resetVersion = (): string => {
  // Reseta contador para 0
  localStorage.setItem(STORAGE_KEY, '0');
  return `v${BASE_VERSION}.00beta`;
};

export const getVersionInfo = () => {
  const counter = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  const version = getVersion();
  
  return {
    version,
    counter,
    baseVersion: BASE_VERSION,
    formatted: version,
    description: `Versão ${BASE_VERSION}.${counter.toString().padStart(2, '0')}beta (${counter} modificações)`
  };
};
