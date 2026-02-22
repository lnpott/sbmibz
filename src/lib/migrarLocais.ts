import { supabase } from '@/integrations/supabase/client';

// Lista de locais que devem ser categorizados como Off-Shore
const locaisOffShore = [
  'P-79', // Plataforma P-79
  'P-31', // Plataforma P-31
  'P-40', // Plataforma P-40
  'P-48', // Plataforma P-48
  'P-50', // Plataforma P-50
  'P-51', // Plataforma P-51
  'P-52', // Plataforma P-52
  'P-53', // Plataforma P-53
  'P-54', // Plataforma P-54
  'P-55', // Plataforma P-55
  'P-56', // Plataforma P-56
  'P-57', // Plataforma P-57
  'P-58', // Plataforma P-58
  'P-59', // Plataforma P-59
  'P-60', // Plataforma P-60
  'P-61', // Plataforma P-61
  'P-62', // Plataforma P-62
  'P-63', // Plataforma P-63
  'P-64', // Plataforma P-64
  'P-65', // Plataforma P-65
  'P-66', // Plataforma P-66
  'P-67', // Plataforma P-67
  'P-68', // Plataforma P-68
  'P-69', // Plataforma P-69
  'P-70', // Plataforma P-70
  'P-71', // Plataforma P-71
  'P-72', // Plataforma P-72
  'P-73', // Plataforma P-73
  'P-74', // Plataforma P-74
  'P-75', // Plataforma P-75
  'P-76', // Plataforma P-76
  'P-77', // Plataforma P-77
  'P-78', // Plataforma P-78
  'FPSO', // FPSO
  'PM-01', // PM-01
  'PM-02', // PM-02
  'PM-03', // PM-03
  'PM-04', // PM-04
  'PM-05', // PM-05
  'PM-06', // PM-06
  'PM-07', // PM-07
  'PM-08', // PM-08
  'PM-09', // PM-09
  'PM-10', // PM-10
  'PM-11', // PM-11
  'PM-12', // PM-12
  'PM-13', // PM-13
  'PM-14', // PM-14
  'PM-15', // PM-15
  'PM-16', // PM-16
  'PM-17', // PM-17
  'PM-18', // PM-18
  'PM-19', // PM-19
  'PM-20', // PM-20
  'PM-21', // PM-21
  'PM-22', // PM-22
  'PM-23', // PM-23
  'PM-24', // PM-24
  'PM-25', // PM-25
  'PM-26', // PM-26
  'PM-27', // PM-27
  'PM-28', // PM-28
  'PM-29', // PM-29
  'PM-30', // PM-30
];

export const migrarLocais = async () => {
  try {
    // Busca todos os locais existentes
    const { data: locais, error } = await supabase
      .from('locais')
      .select('*');

    if (error) {
      return { success: false, error: error.message };
    }

    if (!locais || locais.length === 0) {
      return { success: true, message: 'Nenhum local encontrado para migrar' };
    }

    // Contagem de locais offshore/onshore para informação
    let offshoreCount = 0;
    let onshoreCount = 0;

    // Verifica categorização dos locais (sem modificar tabela)
    for (const local of locais) {
      if (locaisOffShore.includes(local.codigo)) {
        offshoreCount++;
      } else {
        onshoreCount++;
      }
    }

    return { 
      success: true, 
      message: `Análise concluída: ${offshoreCount} locais offshore, ${onshoreCount} locais onshore de ${locais.length} totais` 
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
