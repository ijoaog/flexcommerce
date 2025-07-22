# FlexCommerce — Sistema de Gestão Comercial

**FlexCommerce** é uma solução completa de gestão comercial desenvolvida com tecnologias modernas e escaláveis. Com **Next.js** no frontend, **NestJS** no backend e **MySQL** como banco de dados relacional, o projeto é totalmente containerizado com **Docker**, facilitando a execução em ambientes de **desenvolvimento** e **produção**.

---

## ⚙️ Tecnologias Utilizadas

| Camada         | Tecnologia        |
|----------------|-------------------|
| Frontend       | [Next.js](https://nextjs.org/) (React) |
| Backend        | [NestJS](https://nestjs.com/) (Node.js) |
| Banco de Dados | [MySQL](https://www.mysql.com/) |
| Contêineres    | [Docker](https://www.docker.com/) |
| Servidor Web   | [NGINX](https://nginx.org/) com [Certbot](https://certbot.eff.org/) para SSL |

---

## Ambiente de Desenvolvimento

### 1. Clonar o repositório

```bash
git clone https://github.com/ijoaog/flexcommerce.git
cd flexcommerce
```

### 2. Iniciar com Docker

```bash
docker-compose up --build
```

Esse comando irá iniciar:

- Frontend (Next.js) na porta `3000`
- Backend (NestJS) na porta `3003`
- MySQL na porta `3306`

### 3. Acessar a aplicação

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend (API): [http://localhost:3003](http://localhost:3003)

### 4. Parar os contêineres

```bash
docker-compose down
```

> Obs: Isso *não* remove os dados do banco. Use `-v` se quiser limpar tudo.

---

## 🔐 Variáveis de Ambiente

### 🔧 `.env.development` (exemplo)

**Frontend**
```env
NEXT_PUBLIC_JWT_SECRET=chave-secreta-desenvolvimento
NEXT_PUBLIC_API_URL=http://localhost:3003
```

**Backend**
```env
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=app_db
```

### 🚀 `.env.production` (exemplo)

**Frontend**
```env
NEXT_PUBLIC_JWT_SECRET=chave-secreta-producao
NEXT_PUBLIC_API_URL=https://flexcommerce.com.br
```

**Backend**
```env
DATABASE_HOST=db-prod-url
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=senha-prod
DATABASE_NAME=prod_db
FRONTEND_URL=https://localhost:3000
JWT_SECRET=<sua-chave-secreta>
JWT_EXPIRES_IN=1d
```

---

## 🗂️ Estrutura de Pastas

```
flexcommerce/
├── .github/workflows/deploy.yml  # CI/CD com GitHub Actions
├── frontend/                     # Frontend (Next.js)
├──── .env.development
├──── .env.production
├── backend/                      # Backend (NestJS)
├──── .env.development
├──── .env.production
├── nginx/                        # Configuração do servidor NGINX
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

> Uma outra alternativa seria criar apenas um .env na raiz do projeto.

---

## 🌐 Deploy com NGINX + SSL (Certbot)

O projeto inclui exemplos completos de deploy com NGINX e HTTPS via **Let's Encrypt**.

Exemplo: `nginx/conf.d/default.conf`

Funcionalidades incluídas:

- Redirecionamento de `www.` para sem `www.`
- Redirecionamento de HTTP → HTTPS
- Certificado SSL automático com Certbot
- Reverse Proxy para frontend e backend

### 🔄 Arquivo auxiliar para emissão de SSL (`no_ssl.conf`)

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}
```

> Após emissão do certificado, altere para o arquivo com SSL ativo.

---

## ⚙️ CI/CD com GitHub Actions

O projeto possui integração contínua (CI) e deploy contínuo (CD) com GitHub Actions.

### 🧪 O que a pipeline faz:

1. Valida a ausência de `console.log` no código.
2. Realiza build da aplicação com Docker.
3. Realiza deploy automático para produção ao fazer *merge* na branch `production`.


---

##Comandos Úteis

| Comando | Descrição |
|--------|-----------|
| `docker-compose up --build` | Sobe os serviços de desenvolvimento |
| `docker-compose down` | Para os contêineres |
| `docker-compose down -v` | Remove os contêineres **e os volumes** (⚠️ reset total) |
| `docker-compose -f docker-compose.prod.yml up --build` | Sobe o ambiente de produção |
| `docker-compose -f docker-compose.prod.yml down` | Para o ambiente de produção |

---

## 📢 Considerações Finais

O **FlexCommerce** foi criado com foco em:

- 🔁 **Modularidade e Escalabilidade**
- 🐳 **Ambientes isolados com Docker**
- 🧪 **Testabilidade com pipelines CI/CD**
- 🔐 **Segurança com variáveis de ambiente e HTTPS**

Sinta-se à vontade para contribuir, reportar melhorias ou clonar para base de novos projetos!

TODO: Adicionar migration quando ao banco de dados, componentização no front, etc (até porque a evolução é constante!)

---

# ⚠️Projeto em construção e em constante evolução!⚠️
