# GAMO Web

**GAMO Web** é o frontend da plataforma GAMO, construída com **Next.js** e **TypeScript**, que permite aos colecionadores navegar, cadastrar e gerenciar suas coleções de consoles, jogos e acessórios.

---

## 📦 Tecnologias Principais

- **Next.js** (v15) com **App Router**
- **React** (v19)
- **TypeScript**
- **Tailwind CSS** para estilização
- **Storybook** (v9) para documentação de componentes
- **Vitest** + **@storybook/testing-library** para testes unitários e de interface
- **next-intl** para internacionalização (i18n)
- **Firebase Authentication** para login social
- **Axios** (ou Fetch API) para comunicação com a API

---

## 🎯 Objetivo do Projeto

- Consumir a **GAMO API** para autenticação e operações CRUD na coleção do usuário.
- Oferecer login tradicional (email/senha) e login social (Google via Firebase).
- Roteamento localizados em `/pt/*` e `/en/*`, com **next-intl**.
- Documentar componentes em **Storybook**.
- Estruturar testes com **Vitest** e **@testing-library/react**.

---

## 📂 Estrutura de Pastas

```plaintext
gamo-web/
├── .next/               # Build do Next.js
├── components/          # Componentes reutilizáveis
│   ├── Button/          # Exemplo de componente
│   └── GoogleLoginButton/
├── hooks/               # Hooks React (useGoogleLogin, useAuth, etc)
├── i18n/                # Configuração de roteamento e mensagens
│   ├── routing.ts       # Definição de rotas por locale
│   └── messages/        # arquivos pt.json e en.json
├── pages/ ou app/       # Roteamento do Next.js (App Router)
│   ├── [locale]/        # Layouts e páginas por idioma
│   │   ├── login/       # Página de login
│   │   └── dashboard/   # Dashboard autenticado
│   └── api/             # Rotas API internas (se necessário)
├── public/              # Assets estáticos
├── styles/              # Arquivos CSS/SCSS globais
├── .storybook/          # Configuração do Storybook
├── vitest.config.ts     # Configuração de testes
├── tailwind.config.ts   # Configuração do Tailwind
├── next.config.js       # Configuração do Next.js
├── tsconfig.json        # Configuração do TypeScript
├── package.json         # Scripts e dependências
└── .env.example         # Variáveis de ambiente de exemplo
```

---

## 🚀 Setup Local

### Pré-requisitos

- Node.js v16+ e npm ou yarn
- Git

### Passos

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/gamo-web.git
   cd gamo-web
   ```

2. **Instale dependências**

   ```bash
   npm install
   # ou yarn install
   ```

3. **Arquivo de ambiente**

   ```bash
   cp .env.example .env.local
   ```

   Preencha em `.env.local`:

   ```dotenv
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
   ```

4. **Rodar em modo de desenvolvimento**

   ```bash
   npm run dev
   # ou yarn dev
   ```

5. Acesse `http://localhost:3000/pt/login` ou `http://localhost:3000/en/login`.

---

## 🛠 Scripts Disponíveis

| Script                    | Descrição                                     |
| ------------------------- | --------------------------------------------- |
| `npm run dev`             | Inicia o servidor Next.js com Turbopack       |
| `npm run build`           | Compila o app para produção                   |
| `npm run start`           | Inicia o app em modo produção                 |
| `npm run lint`            | Executa ESLint                                |
| `npm run storybook`       | Inicia o Storybook em `http://localhost:6006` |
| `npm run build-storybook` | Gera build estático do Storybook              |
| `npm test`                | Roda testes com Vitest                        |
| `npm run coverage`        | Gera relatório de cobertura                   |

---

## 🔧 Configuração de Storybook

1. **Iniciar**

   ```bash
   npm run storybook
   ```

2. **Adicionar stories**
   Coloque arquivos `.stories.tsx` na pasta de componentes.
3. **Testes de UI**
   Vitest integrado via `@storybook/experimental-addon-test`.

---

## 🌐 Internacionalização (i18n)

- Padrão de roteamento: `/[locale]/[...]`, onde `locale` é `pt` ou `en`.
- **next-intl** lê os JSON em `i18n/messages/{locale}.json`.
- Para usar traduções:

  ```tsx
  import { useTranslations } from "next-intl";
  const t = useTranslations("dashboard");
  <h1>{t("title")}</h1>;
  ```

---

## 🔑 Autenticação

- **Login Social** com Google (Firebase): use o hook `useGoogleLogin` e o componente `GoogleLoginButton`.
- Armazena o JWT retornado pela API no **localStorage** sob a chave `gamo_token`.
- Contexto global `AuthContext` gerencia estado de login e rota protegida (`/dashboard`).

---

## ⚙️ Deploy em Produção

### Vercel

1. Conecte o repositório no Vercel.
2. Defina as variáveis de ambiente no painel (Settings → Environment Variables):

   ```env
   NEXT_PUBLIC_API_URL=https://gamo-api-production.up.railway.app
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```

3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Deploy. O domínio `gamo.games` já deve apontar para o projeto.

---

## 🧪 Testes

- **Unitários**: Vitest + Testing Library
- **Rodar**:

  ```bash
  npm test
  ```

- **Cobertura**:

  ```bash
  npm run coverage
  ```

---

## 🤝 Contribuições

Feedbacks, issues e pull requests são muito bem-vindos! Siga o guia de contribuições no repositório.

---

_Desenvolvido com ❤️ por Mateus Arantes_
