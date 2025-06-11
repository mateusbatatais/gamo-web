# GAMO Web

**GAMO Web** é o frontend da plataforma GAMO, construída com **Next.js** e **TypeScript**, que permite aos colecionadores navegar, cadastrar e gerenciar suas coleções de consoles, jogos e acessórios.

---

## ⚙️ Tecnologias e Dependências

- **Next.js** 15 (App Router, TypeScript)
- **React** 19
- **Tailwind CSS** + **SCSS**
- **next-intl** para internacionalização
- **next-cloudinary** para upload de imagem
- **firebase** para autenticação e storage
- **lucide-react** para ícones
- **clsx** para composição de classes CSS
- **react-image-crop** para recorte de imagem

#### Dev Dependencies

- **pnpm**
- **ESLint** + **Prettier** + **lint-staged** + **Husky**
- **Vitest** para testes unitários
- **@testing-library/react** + **@testing-library/jest-dom**
- **Storybook** 9 com addons de docs e temas
- **Playwright** para testes E2E
- **Chromatic** para preview de componentes

---

## 📁 Estrutura de Pastas

`app/` principais _routes_ e layouts (Next.js App Router)

```
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

**Configurar `.env.local`** com as chaves acima
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

- **Cobertura**:

  ```bash
  pnpm run coverage
  ```

---

## 🤝 Contribuições

Feedbacks, issues e pull requests são muito bem-vindos! Siga o guia de contribuições no repositório.

---

_Desenvolvido com ❤️ por Mateus Arantes_
