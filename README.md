# 💻 Ecommerce-API-ShopCo-Node (RESTful API)

Uma API RESTful de alto desempenho construída com **Node.js** e **Express** para servir como o *backend* completo da plataforma de e-commerce Shop.co. A API é responsável por gerenciar o catálogo de produtos, perfis de usuário, autenticação segura e todo o ciclo de vida dos pedidos transacionais.

## 🚀 Tecnologias e Ferramentas

| Categoria | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express.js | Ambiente de execução assíncrono e framework web minimalista e flexível. |
| **Banco de Dados** | [Mencione: Ex: **MongoDB** ou **PostgreSQL**] | [Especifique a natureza: Ex: NoSQL flexível para catálogo ou SQL relacional para transações]. |
| **ORM/ODM** | [Mencione: Ex: **Mongoose** (para Mongo) ou **Sequelize** / **Prisma** (para SQL)] | Camada de abstração para manipulação de dados e modelagem de esquema. |
| **Autenticação** | JSON Web Tokens (JWT) | Segurança baseada em tokens para proteção de rotas e manutenção de sessões de usuário. |
| **Segurança** | **BCrypt** | Utilizado para hashing de senhas, garantindo a segurança dos dados do usuário. |
| **Documentação** | [Mencione: Ex: **Swagger** ou **Postman Collection**] | Facilitando a visualização e os testes interativos dos endpoints. |

## ✨ Principais Funcionalidades (Endpoints Chave)

A API é modularizada para cobrir as principais necessidades de uma aplicação de e-commerce:

| Módulo | Funcionalidades | Endpoints de Exemplo |
| :--- | :--- | :--- |
| **Autenticação** | Registro de novos usuários, Login seguro, Geração e Verificação de Token JWT. | `POST /api/auth/register`, `POST /api/auth/login` |
| **Produtos** | CRUD completo para o catálogo, incluindo busca por texto, filtros por categoria e paginação otimizada. | `GET /api/products`, `POST /api/products` (Admin) |
| **Pedidos** | Criação de novos pedidos, listagem por usuário e detalhamento transacional. | `POST /api/orders`, `GET /api/orders/{id}` |
| **Carrinho** | Adicionar, remover e atualizar itens no carrinho de compras (lógica de estado volátil ou persistente). | `PUT /api/cart/add/{product_id}`, `DELETE /api/cart/remove/{product_id}` |
| **Usuários** | Gerenciamento de perfis de usuário, endereços e informações de contato. | `GET /api/users/{id}`, `PUT /api/users/{id}` |

## 💡 Arquitetura e Padrões

O projeto segue um padrão modular com o objetivo de manter o código limpo, testável e escalável:

* **Estrutura Baseada em Recursos:** O código é organizado por recursos (e.g., `src/products`, `src/users`), facilitando a manutenção.
* **Middlewares:** Uso estratégico de middlewares para validação de esquemas (ex: Joi), tratamento de autenticação (JWT) e manipulação centralizada de erros.
* **Lógica Assíncrona:** Implementação nativa de *Promises* e `async/await` para garantir operações de I/O eficientes e não-bloqueantes.
* **Variáveis de Ambiente:** Utilização de arquivos `.env` para gerenciar informações sensíveis e configurações de banco de dados.

## 🔗 Link para o Frontend

Esta API é o *motor* do cliente web desenvolvido em React, que oferece a interface de usuário:

* **Repositório do Cliente (ShopCo):** [Link para o repositório `Ecommerce-Client-ShopCo-React`]

## 🛠 Configuração e Instalação Local

Siga os passos abaixo para ter a API rodando em sua máquina local:

### Pré-requisitos
* Node.js (LTS recomendado)
* [Mencione o DB: Ex: Docker ou instalação local do MongoDB/PostgreSQL]

### Passos

1.  **Clone o Repositório:**
    ```bash
    git clone [https://docs.github.com/pt/repositories/creating-and-managing-repositories/creating-a-new-repository](https://docs.github.com/pt/repositories/creating-and-managing-repositories/creating-a-new-repository)
    cd Ecommerce-API-ShopCo-Node
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    # ou yarn install
    ```

3.  **Configuração de Ambiente (`.env`):**
    Crie um arquivo chamado `.env` na raiz do projeto e adicione as seguintes variáveis obrigatórias (ajuste os valores conforme sua configuração):

    ```env
    PORT=3000
    DATABASE_URL="[SUA_STRING_DE_CONEXÃO_COM_O_DB]"
    JWT_SECRET="[SUA_CHAVE_SECRETA_PARA_JWT]"
    # NODE_ENV=development
    ```

4.  **Inicie o Servidor:**
    ```bash
    npm start
    ```

O servidor estará rodando em `http://localhost:3000` (ou na porta definida em sua variável `PORT`).

* **Recomendação:** Acesse o endpoint do Swagger (se documentado) ou use uma ferramenta como Postman para explorar e testar os recursos da API.
