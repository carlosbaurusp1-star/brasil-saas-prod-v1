# Brasil Mostra Brasil - SaaS Dashboard

Plataforma de análise de conversas com IA integrada, built with Next.js, React, Supabase, e Recharts.

## 🚀 Funcionalidades

- **Dashboard**: Visão geral com cards de totais e gráficos de sentiment
- **Relatórios**: Análise detalhada com múltiplos gráficos (pizza e barras)
- **CRM Management**: Gerenciar múltiplos CRMs conectados
- **Agentes de IA**: Monitorar e executar agentes inteligentes
- **Autenticação**: Login/Signup com Supabase Auth
- **Responsive Design**: Otimizado para desktop e mobile

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Gráficos**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+
- NPM ou Yarn
- Conta no Supabase
- Conta no Vercel

## 🔧 Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/brasil-mostra-brasil-saas.git
cd brasil-mostra-brasil-saas
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://sua-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
NEXT_PUBLIC_API_URL=https://brasil-mostra-brasil-backend.vercel.app
```

Você pode encontrar essas variáveis no seu dashboard do Supabase.

### 4. Rodar localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🚀 Deploy no Vercel

### Opção 1: Deploy automático via GitHub

1. Faça push do seu código para GitHub
2. Vá para [vercel.com/new](https://vercel.com/new)
3. Importe seu repositório GitHub
4. Adicione as variáveis de ambiente
5. Click em Deploy

### Opção 2: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel
```

## 📊 Estrutura do Projeto

```
brasil-mostra-brasil-saas/
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Dashboard)
│   ├── login/
│   ├── relatorios/
│   ├── crms/
│   ├── agentes/
│   └── globals.css
├── components/
│   ├── Sidebar.tsx
│   └── DashboardCard.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   └── supabase.ts
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🔐 Autenticação

O projeto usa Supabase Auth para autenticação. Para testar:

1. Vá para a página de login em `/login`
2. Crie uma nova conta ou faça login
3. Você será redirecionado para o dashboard

## 📞 Suporte

Para suporte, entre em contato através do email ou abra uma issue no GitHub.

## 📝 Licença

MIT
