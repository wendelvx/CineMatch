🎬 CineMatch

CineMatch é uma aplicação Web Progressiva (PWA) projetada para acabar com a indecisão na hora de escolher um filme. Funciona como um "Tinder de Filmes": crie uma sala, convide seu parceiro(a) ou amigos, escolha um gênero e deslizem os cartões. Quando todos derem "Like" no mesmo filme... É um Match! 🍿
✨ Funcionalidades

    Criação de Salas: Gere um código único para compartilhar.

    Sem Login: Uso de UUIDs anônimos para acesso rápido e sem fricção.

    Filtro por Gênero: Escolha entre Terror, Comédia, Ação, etc.

    Swipe Interface: Interface intuitiva de arrastar para Direita (Like) ou Esquerda (Dislike).

    Match em Tempo Real: Sistema de Polling que verifica votos e notifica instantaneamente quando há consenso.

    Algoritmo Inteligente: Embaralhamento determinístico baseado no código da sala (garante que todos vejam os mesmos filmes aleatórios na mesma ordem).

    Detalhes do Filme: Clique no card para ver sinopse completa.

    PWA (Mobile First): Instalável no celular como um aplicativo nativo (ícone na home, tela cheia).

🛠️ Tecnologias Utilizadas
Front-end

    React (Vite)

    TailwindCSS (Estilização)

    Framer Motion (Animações de Swipe e Drag)

    Axios (Comunicação HTTP)

    Vite PWA Plugin (Transformação em App instalável)

    Lucide React (Ícones)

Back-end

    Node.js com Express

    Prisma ORM (Gerenciamento do Banco de Dados)

    MySQL (Banco de Dados Relacional)

    CORS (Configurado para acesso via rede local/Wi-Fi)

Integração

    TMDB API (The Movie Database) para dados dos filmes.

🚀 Como Rodar o Projeto Localmente
Pré-requisitos

    Node.js instalado.

    MySQL rodando (via XAMPP, Docker ou local).

    Uma conta no TMDB para obter a API Key.

1. Configuração do Back-end

    Acesse a pasta do servidor:
    Bash

cd back-end

Instale as dependências:
Bash

npm install

Configure o arquivo .env: Crie um arquivo .env na raiz do back-end e adicione:
Snippet de código

DATABASE_URL="mysql://SEU_USUARIO:SUA_SENHA@localhost:3306/cinematch_db"
TMDB_API_KEY="SUA_CHAVE_DA_API_TMDB_AQUI"
PORT=3000

Configure o Banco de Dados com Prisma:
Bash

npx prisma db push

Inicie o servidor:
Bash

    node app.js

    O terminal deve exibir: 🔥 Servidor rodando na porta 3000 e aceitando conexões externas!

2. Configuração do Front-end

    Acesse a pasta do front:
    Bash

cd cinematch-front

Instale as dependências:
Bash

npm install

Configuração de IP (Crucial para Mobile):

    Abra o terminal do seu computador e digite ipconfig (Windows) ou ifconfig (Linux/Mac) para descobrir seu IPv4 local (ex: 192.168.1.5).

    Abra o arquivo src/services/api.js.

    Atualize a baseURL com o seu IP:
    JavaScript

    baseURL: 'http://192.168.1.5:3000/api', // Use o SEU IP

Inicie o projeto:
Bash

    npm run dev

    O terminal deve exibir: ➜ Network: http://192.168.1.5:5173/

📱 Como Testar no Celular (Modo PWA)

Para usar o app no celular junto com outra pessoa na mesma casa:

    Certifique-se de que o PC e o Celular estão no mesmo Wi-Fi.

    Garanta que o Firewall do Windows não está bloqueando a porta 3000 (Node) ou 5173 (Vite).

        Dica: Você pode criar uma regra de entrada no Firewall para a porta 3000 ou desativá-lo temporariamente para testes.

    No navegador do celular (Chrome no Android ou Safari no iOS), acesse o endereço IP mostrado no terminal do Front-end (ex: http://192.168.1.5:5173).

    Instalar o App:

        Android: Toque nos 3 pontos > "Instalar aplicativo" ou "Adicionar à tela inicial".

        iOS: Toque no botão Compartilhar > "Adicionar à Tela de Início".

    Abra o app pelo ícone criado e divirta-se!

📂 Estrutura do Projeto

/
├── back-end/
│   ├── prisma/            # Schema do banco de dados
│   ├── src/
│   │   ├── controllers/   # Lógica das rotas (Room, Vote, Movie)
│   │   ├── services/      # Regras de negócio e chamadas TMDB
│   │   └── utils/         # Geradores de código
│   └── app.js             # Ponto de entrada do servidor
│
└── cinematch-front/
    ├── public/            # Ícones do PWA e manifesto
    ├── src/
    │   ├── components/    # Cards, Modais
    │   ├── pages/         # Home, Room
    │   ├── services/      # Configuração Axios e UUID
    │   └── App.jsx        # Rotas
    └── vite.config.js     # Configuração PWA e Host

📝 Licença

Este projeto foi desenvolvido para fins de estudo e uso pessoal. Sinta-se livre para contribuir!

Feito com ❤️ e muito café. ☕