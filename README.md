# Sistema de Gerenciamento de RTs

## Sobre o Projeto

Sistema web para gerenciamento de Remessas de Transporte (RTs), desenvolvido para controle logístico de remessas com acompanhamento de status em tempo real.

## Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (banco de dados e autenticação)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Icons**: Lucide React

## Funcionalidades

- ✅ Gestão completa de RTs (criar, editar, acompanhar)
- ✅ Controle de status: Pendente → Coletada → Despachada
- ✅ Sistema multi-agentes
- ✅ Dashboard com estatísticas em tempo real
- ✅ Geração de relatórios e impressão
- ✅ Interface responsiva e moderna

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## Instalação

```bash
# Clone o repositório
git clone https://github.com/lnpott/sbmibz.git

# Entre no diretório
cd sbmibz

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# Inicie o servidor de desenvolvimento
npm run dev
```

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run build:dev` - Build modo desenvolvimento
- `npm run preview` - Preview do build
- `npm run lint` - Executa ESLint

## Estrutura do Projeto

```
src/
├── components/     # Componentes UI reutilizáveis
├── pages/         # Páginas principais
├── hooks/         # Hooks personalizados
├── types/         # Definições TypeScript
├── lib/           # Utilitários e configurações
└── integrations/  # Integração com Supabase
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está sob licença MIT.
