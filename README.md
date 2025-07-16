
# FLEXCOMMERCE 

Este é um sistema de gestão comercial desenvolvido utilizando **Next.js** no frontend e **NestJS** no backend, com **MySQL** como banco de dados. A aplicação pode ser executada tanto no ambiente de **desenvolvimento** quanto de **produção**, usando **Docker** para facilitar a configuração e execução.

## 🛠️ **Tecnologias utilizadas**

- **Frontend**: Next.js (React)
- **Backend**: NestJS (Node.js)
- **Banco de dados**: MySQL
- **Docker**: Utilizado para desenvolvimento e produção

---

## 🚀 **Como rodar o aplicativo em desenvolvimento**

Para rodar o aplicativo em desenvolvimento, siga os passos abaixo:

### 1. **Clonando o repositório**

```bash
git clone https://github.com/ijoaog/flexcommerce.git
cd flexcommerce
```

### 2. **Rodando o ambiente de desenvolvimento com Docker**

Este comando irá levantar tanto o frontend quanto o backend em contêineres Docker, junto com o MySQL como banco de dados.

```bash
docker-compose up --build
```

### 3. **Acessando o aplicativo**

- **Frontend**: Acesse a aplicação frontend na URL [http://localhost:3000](http://localhost:3000).
- **Backend**: O backend estará disponível na URL [http://localhost:3001](http://localhost:3001) (para testes de API, por exemplo).

### 4. **Parando os contêineres**

Para parar os contêineres, basta rodar:

```bash
docker-compose down
```

Isso irá parar e remover os contêineres em execução, mas **não excluirá** os dados do banco de dados.

---

## 🚀 **Como rodar o aplicativo em produção**

Para rodar o aplicativo em produção, você deve usar a versão otimizada de produção do Docker, com a configuração específica para isso.

### 1. **Rodando o ambiente de produção com Docker**

Este comando irá subir o ambiente de produção, com a configuração correta para o backend e frontend otimizados.

```bash
docker-compose -f docker-compose.prod.yml up --build
```

### 2. **Acessando o aplicativo**

- **Frontend**: O frontend estará acessível na URL [http://localhost:3000](http://localhost:3000), ou na URL configurada no ambiente de produção.
- **Backend**: O backend estará acessível na URL [http://localhost:3001](http://localhost:3001) para fins de testes de API.

### 3. **Parando os contêineres**

Para parar os contêineres em produção:

```bash
docker-compose -f docker-compose.prod.yml down
```

---

## 📊 **Portas utilizadas**

- **Frontend (Next.js)**: `3000` (pode ser acessado através de `http://localhost:3000` no desenvolvimento ou na URL configurada em produção).
- **Backend (NestJS)**: `3001` (pode ser acessado através de `http://localhost:3001` para testar a API, ou na URL configurada em produção).
- **Banco de dados (MySQL)**: `3306` (não acessível diretamente no ambiente de produção sem configuração específica).

---

## 📝 **Configuração de variáveis de ambiente**

O projeto utiliza variáveis de ambiente para configurar o banco de dados e outras credenciais.

Você pode configurar variáveis de ambiente no arquivo `.env` para os dois ambientes:

### Exemplo de `.env` para desenvolvimento:

```env
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=app_db
```

### Exemplo de `.env` para produção (alterar conforme necessário):

```env
DATABASE_HOST=prod-db-host
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=prod-password
DATABASE_NAME=prod_db
```

---

## 🚧 **CI/CD - Integração Contínua e Deploy**

Este projeto também pode ser configurado para pipelines de CI/CD no GitHub Actions, GitLab CI, etc. A estrutura já conta com um diretório `.github/` para colocar as definições de workflows de deploy.

---

## 🔧 **Comandos úteis**

### Para rodar o frontend e backend em containers Docker no desenvolvimento:

```bash
docker-compose up --build
```

### Para rodar o ambiente de produção:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

### Para parar os contêineres:

```bash
docker-compose down
```

### Para limpar volumes do banco de dados (em caso de reset completo):

```bash
docker-compose down -v
```

---

## 📢 **Considerações finais**

Este projeto foi desenvolvido com o objetivo de ser facilmente escalável e configurável, tanto para o ambiente de desenvolvimento quanto para produção. Usamos **Docker** para simplificar a configuração e facilitar o gerenciamento de ambientes.
