import { useRTData } from './useRTData';
import { useRTMutations } from './useRTMutations';

export const useRTNew = () => {
  const data = useRTData();
  const mutations = useRTMutations();

  return {
    ...data,
    ...mutations,
  };
};
