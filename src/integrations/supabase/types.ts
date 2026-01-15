export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agentes: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          acao: string
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          descricao: string | null
          id: string
          registro_id: string
          tabela: string
          usuario: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          id?: string
          registro_id: string
          tabela: string
          usuario?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          descricao?: string | null
          id?: string
          registro_id?: string
          tabela?: string
          usuario?: string | null
        }
        Relationships: []
      }
      coletores: {
        Row: {
          cpf: string
          created_at: string
          email: string | null
          empresa_id: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          cpf: string
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          cpf?: string
          created_at?: string
          email?: string | null
          empresa_id?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coletores_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      locais: {
        Row: {
          codigo: string
          created_at: string
          descricao: string | null
          id: string
        }
        Insert: {
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
        }
        Update: {
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
        }
        Relationships: []
      }
      rt_edicoes: {
        Row: {
          dados_anteriores: Json
          dados_novos: Json
          editado_em: string
          id: string
          motivo: string
          rt_id: string
        }
        Insert: {
          dados_anteriores: Json
          dados_novos: Json
          editado_em?: string
          id?: string
          motivo: string
          rt_id: string
        }
        Update: {
          dados_anteriores?: Json
          dados_novos?: Json
          editado_em?: string
          id?: string
          motivo?: string
          rt_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rt_edicoes_rt_id_fkey"
            columns: ["rt_id"]
            isOneToOne: false
            referencedRelation: "rts"
            referencedColumns: ["id"]
          },
        ]
      }
      rts: {
        Row: {
          agente_id: string | null
          classificacao: Database["public"]["Enums"]["classificacao_carga"]
          coletada_em: string | null
          coletor_id: string | null
          created_at: string
          data_prevista_despacho: string | null
          data_recebimento_base: string | null
          descricao: string | null
          despachada_em: string | null
          destino: string
          destino_id: string | null
          entregador_id: string | null
          id: string
          natureza: Database["public"]["Enums"]["natureza_rt"]
          numero: string
          numeros_anteriores: string[] | null
          origem: string
          origem_id: string | null
          peso: number
          programacao: string | null
          rt_origem_transbordo_id: string | null
          status: Database["public"]["Enums"]["status_rt"]
          valor: number
        }
        Insert: {
          agente_id?: string | null
          classificacao?: Database["public"]["Enums"]["classificacao_carga"]
          coletada_em?: string | null
          coletor_id?: string | null
          created_at?: string
          data_prevista_despacho?: string | null
          data_recebimento_base?: string | null
          descricao?: string | null
          despachada_em?: string | null
          destino: string
          destino_id?: string | null
          entregador_id?: string | null
          id?: string
          natureza: Database["public"]["Enums"]["natureza_rt"]
          numero: string
          numeros_anteriores?: string[] | null
          origem: string
          origem_id?: string | null
          peso?: number
          programacao?: string | null
          rt_origem_transbordo_id?: string | null
          status?: Database["public"]["Enums"]["status_rt"]
          valor?: number
        }
        Update: {
          agente_id?: string | null
          classificacao?: Database["public"]["Enums"]["classificacao_carga"]
          coletada_em?: string | null
          coletor_id?: string | null
          created_at?: string
          data_prevista_despacho?: string | null
          data_recebimento_base?: string | null
          descricao?: string | null
          despachada_em?: string | null
          destino?: string
          destino_id?: string | null
          entregador_id?: string | null
          id?: string
          natureza?: Database["public"]["Enums"]["natureza_rt"]
          numero?: string
          numeros_anteriores?: string[] | null
          origem?: string
          origem_id?: string | null
          peso?: number
          programacao?: string | null
          rt_origem_transbordo_id?: string | null
          status?: Database["public"]["Enums"]["status_rt"]
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "rts_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rts_coletor_id_fkey"
            columns: ["coletor_id"]
            isOneToOne: false
            referencedRelation: "coletores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rts_destino_id_fkey"
            columns: ["destino_id"]
            isOneToOne: false
            referencedRelation: "locais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rts_entregador_id_fkey"
            columns: ["entregador_id"]
            isOneToOne: false
            referencedRelation: "coletores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rts_origem_id_fkey"
            columns: ["origem_id"]
            isOneToOne: false
            referencedRelation: "locais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rts_rt_origem_transbordo_id_fkey"
            columns: ["rt_origem_transbordo_id"]
            isOneToOne: false
            referencedRelation: "rts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      classificacao_carga: "comum" | "fragil"
      natureza_rt: "coleta" | "despacho" | "transbordo"
      status_rt: "pendente" | "coletada" | "despachada"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      classificacao_carga: ["comum", "fragil"],
      natureza_rt: ["coleta", "despacho", "transbordo"],
      status_rt: ["pendente", "coletada", "despachada"],
    },
  },
} as const
