
# Contato Seguro API

API Backend usando Node.js para o teste técnico da Contato Seguro

- [BaseURL](https://contato-seguro-api.onrender.com)

## Sumário
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Como usar](#como-usar)
- [Como contribuir](#como-contribuir)
- [Licença](#licença)

## Tecnologias Utilizadas

- Node.js
- Express
- Knex.js
- Jest

## Funcionalidades

- Adicionar um novo usuário
- Editar um usuário
- Deletar um usuário
- Retornar lista de usuários, podendo filtrar por campos

- Adicionar uma nova empresa
- Editar uma empresa
- Deletar uma empresa
- Retornar lista de empresas, podendo filtrar por campos

- Adicionar um novo registro
- Deletar um registro
- Retornar lista de registros, podendo filtrar por campos

## Como usar

1. Clone o repositório: git clone https://github.com/seu-usuario/seu-projeto.git
2. Instale as dependências: npm install
3. Execute o servidor: npm run dev

### Rotas

- GET /users - Retorna uma lista de todos os usuários cadastrados.
- GET /companies - Retorna uma lista de todas as empresas cadastradas.
- GET /register - Retorna uma lista de todos os registros cadastrados.
- GET /register/list - Retorna uma lista de todos os usuários com um campo adicional de empresas da qual ele faz parte.

- POST /users - Cria um novo usuário no banco de dados.
    - Parâmetros:
        - name (obrigatório)
        - email (obrigatório)
        - phone
        - birthday
        - hometown
- POST /companies - Cria uma nova empresa no banco de dados.
    - Parâmetros:
        - name (obrigatório)
        - cnpj (obrigatório)
        - address (obrigatório)
- POST /register - Cria um novo registro no banco de dados.
    - Parâmetros:
        - user_id (obrigatório)
        - company_id (obrigatório)

- PUT /users/id - Edit um usuário no banco de dados.
    - Parâmetros:
        - name (obrigatório)
        - email (obrigatório)
        - phone
        - birthday
        - hometown
- PUT /companies/id - Edit uma empresa no banco de dados.
    - Parâmetros:
        - name (obrigatório)
        - cnpj (obrigatório)
        - address (obrigatório)
- PUT /register/id - Edit um registro no banco de dados.
    - Parâmetros:
        - user_id (obrigatório)
        - company_id (obrigatório)

- DELETE /users:id - Delete o usuário com o id especificado.
- DELETE /companies:id - Delete a empresa com o id especificado.
- DELETE /register:id - Delete o registro com o id especificado.

## Como contribuir

Para contribuir com o projeto, por favor siga os seguintes passos:

- Faça um fork do projeto
- Crie uma nova branch: git checkout -b minha-feature
- Faça as alterações necessárias
- Faça o commit das suas alterações: git commit -m 'Minha nova feature'
- Faça o push para a branch criada: git push origin minha-feature
- Abra um pull request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
