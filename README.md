# Cloud Storage Privado (Vercel)

Este projeto é um cloud storage privado para fotos, vídeos e arquivos, com autenticação, privacidade por usuário e interface em francês. Pronto para deploy no Vercel.

## Como fazer o deploy no Vercel

1. **Suba esta pasta para um repositório no GitHub.**
2. **Acesse [vercel.com](https://vercel.com) e faça login/crie uma conta.**
3. **Clique em "New Project" e conecte seu repositório.**
4. **Escolha a pasta `frontend` como root do projeto.**
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Clique em "Deploy".**
8. **Acesse a URL gerada pelo Vercel.**

## Funcionalidades
- Upload de fotos, vídeos, PDFs, Word, etc.
- Visualização e download dos arquivos enviados
- Exclusão definitiva de arquivos
- Autenticação (criação de conta, login, logout)
- Privacidade: só vê e envia arquivos quem está logado
- Interface em francês

## Como usar
1. Crie uma conta na tela inicial
2. Faça login
3. Envie arquivos usando o botão
4. Visualize, baixe ou exclua arquivos

## Observações
- Todos os arquivos são privados por usuário
- O backend está implementado em funções serverless (`/api`) compatíveis com Vercel
- Não é necessário rodar backend localmente

---

Se precisar de ajuda para subir no Vercel, só avisar!
