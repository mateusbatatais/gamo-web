# GAMO Web

**GAMO Web** é a aplicação frontend da plataforma GAMO, desenvolvida para colecionadores gerenciarem e explorarem suas coleções de consoles, jogos e acessórios de video game. Construída com uma stack moderna e robusta, oferece alta performance, internacionalização e uma experiência de usuário premium.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase)

---

## ⚙️ Tecnologias e Dependências

---

### Frontend & Framework

- **Next.js 15** com App Router e TypeScript
- **React 19** com hooks e context API
- **TanStack Query** (React Query) para gerenciamento de estado do servidor
- **i18n** com next-intl para internacionalização

### Estilização & UI

- **Tailwind CSS** com utilitários personalizados
- **SCSS** para estilos complexos e modulares
- **Material-UI** para componentes complexos e acessíveis
- **clsx** para composição condicional de classes CSS

### Autenticação & Storage

- **Firebase Auth** com provedores Google e Microsoft
- **Firebase Storage** para armazenamento de arquivos
- **next-cloudinary** para otimização e manipulação de imagens
- **react-image-crop** para recorte de imagens

### Utilidades

- **lucide-react** para conjunto de ícones
- **date-fns** para manipulação de datas (se aplicável)

### Dev Dependencies

#### Qualidade de Código

- **ESLint** + **Prettier** para linting e formatação
- **Husky** + **lint-staged** para pre-commit hooks
- **Commitlint** para convenção de commits (se aplicável)

#### Testes

- **Vitest** para testes unitários e de integração
- **@testing-library/react** + **@testing-library/jest-dom**
- **Playwright** para testes end-to-end (E2E)
- **MSW** para mock de APIs (se aplicável)

#### Documentação & Storytelling

- **Storybook 9** com addons de documentação e temas
- **Chromatic** para visualização e deploy de componentes

#### Ferramentas de Desenvolvimento

- **TypeScript** para tipagem estática
- **pnpm** para gerenciamento de pacotes
- **LogRocket** para monitoramento de erros em produção

### Infraestrutura & Deploy

- **Vercel** para deploy e CI/CD automatizado
- **GitHub Actions** para automação de workflows (se aplicável)

---

**Principais características:** Atomic Design, Dark Mode, PWA (se aplicável), SEO otimizado, performance monitoring

A versão melhorada inclui:

- Organização por categorias lógicas
- Menção explícita às tecnologias que você citou mas não estavam listadas
- Melhor hierarquia visual
- Agrupamento temático das dependências
- Informações mais completas sobre o uso de cada tecnologia

---

## 📁 Estrutura de Pastas

`app/` principais _routes_ e layouts (Next.js App Router)

```
@types/
app/
  [locale]/
    auth/
    site/
    admin/
    layout.tsx
    loading.tsx
    page.tsx
  favicon.ico
  globals.scss
  layout.tsx
  not-found.tsx
  page.tsx
components/
  atoms/       # componentes básicos, atômicos
  molecules/   # grupos de átomos
  organisms/   # componentes maiores (e.g. Account)
  templates/   # páginas padrões
contexts/      # React Contexts
hooks/         # custom hooks
i18n/          # configuração internacionalização (next-intl)
lib/           # helpers e configurações (e.g. api client)
messages/      # arquivos JSON de tradução (pt.json, en.json)
public/        # assets estáticos (imagens, ícones)
styles/        # arquivos SCSS/Tailwind config se houver
utils/         # funções utilitárias

.next/         # build do Next.js (gerado)
.storybook/    # sandbox Storybook (gerado)
```

---

## 🔧 Instruções Iniciais

**Instalar dependências**

```bash
pnpm install
```

**Configurar `.env.local`**
**Rodar em dev**

```bash
pnpm dev
```

**Storybook** (componentes)

```bash
pnpm storybook
```

**Testes**

```bash
pnpm test
```

Preencha em `.env.local`:

```dotenv
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   NEXT_PUBLIC_API_URL=
```

---

## 🛠 Scripts Disponíveis

```jsonc
{
  "dev": "next dev --turbopack", // rodar localmente
  "build": "next build", // build de produção
  "start": "next start", // iniciar servidor
  "lint": "next lint --dir app", // lint do código
  "storybook": "storybook dev -p 6006", // rodar Storybook
  "build-storybook": "storybook build", // gerar Storybook estático
  "test": "vitest", // testes unitários
  "test-storybook": "vitest --project=storybook",
  "chromatic": "npx chromatic --project-token=chpt_...",
  "prepare": "husky install", // hooks git
}
```

---

## 🔧 Configuração de Storybook

1. **Iniciar**

   ```bash
   pnpm run storybook
   ```

2. **Adicionar stories**
   Coloque arquivos `.stories.tsx` na pasta de componentes.

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

## 🧪 Testes

- **Unitários**: Vitest + Testing Library
- **Rodar**:

  ```bash
  pnpm test
  ```

- **E2E**:

  ```bash
  pnpm e2e
  ```

---

## 🤝 Contribuições

Feedbacks, issues e pull requests são muito bem-vindos! Siga o guia de contribuições no repositório.

---

_Desenvolvido com ❤️ por Mateus Arantes_
