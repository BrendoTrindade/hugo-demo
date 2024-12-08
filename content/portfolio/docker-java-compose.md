---
title: "Dockerize a Java Web Application using docker-compose"
date: 2023-09-27T21:29:31-03:00
draft: false
tags: ['terraform', 'portifolio', 'aws', 'Java', 'Docker']

cover:
  image: "/banner/aws-docker-architecture-complete.png"
  alt: "Arquitetura Docker Compose para Aplicação Java"
  caption: "Dockerização de Aplicação Java Multi-Container"
  relative: false
  hidden: false
---

## Implementação de uma Aplicação Java Multi-Container com Docker

Este artigo documenta a implementação de uma aplicação Java de login usando Docker Compose, com uma arquitetura multi-container incluindo Nginx, Tomcat e MySQL.

## Visão Geral do Projeto

### Objetivos
- Implementar uma aplicação Java de login
- Utilizar arquitetura multi-container com Docker Compose
- Configurar proxy reverso com Nginx
- Implementar persistência de dados com MySQL
- Automatizar o deployment com Terraform na AWS

### Arquitetura
- **Frontend/Proxy**: Nginx na porta 80
- **Aplicação**: Tomcat na porta 8080
- **Banco de Dados**: MySQL na porta 3306

### 1. Estrutura do Projeto
```
Projeto-docker/
├── java-login-app/     # Aplicação Java
├── mysql/              # Configurações MySQL
│   ├── init.sql       # Script de inicialização
├── nginx/              # Configurações Nginx
│   ├── nginx.conf     # Configuração do proxy
├── tomcat/             # Configurações Tomcat
│   ├── Dockerfile     # Customização Tomcat
│   ├── tomcat-users.xml
│   └── context.xml
└── docker-compose.yml
```

### 2. Configuração dos Containers

#### MySQL Container
```yaml
mysql:
  image: mysql:8.0
  environment:
    MYSQL_DATABASE: logindb
    MYSQL_USER: loginuser
    MYSQL_PASSWORD: loginpass
    MYSQL_ROOT_PASSWORD: rootpass
  ports:
    - "3306:3306"
```

#### Tomcat Container
```dockerfile
FROM tomcat:9.0.83-jdk8-corretto

# Install additional packages
RUN yum update -y && \
    yum install -y mysql telnet && \
    yum clean all

# Remover aplicações padrão
RUN rm -rf /usr/local/tomcat/webapps/*

# Criar diretório ROOT
RUN mkdir -p /usr/local/tomcat/webapps/ROOT

# Copiar o arquivo WAR
COPY login.war /usr/local/tomcat/webapps/ROOT.war

# Extrair o WAR manualmente
RUN cd /usr/local/tomcat/webapps/ROOT && jar xf ../ROOT.war && rm ../ROOT.war

# Configurar permissões
RUN chmod +x /usr/local/tomcat/bin/*.sh

# Copy configuration files
COPY tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
COPY context.xml /usr/local/tomcat/webapps/manager/META-INF/context.xml
COPY context.xml /usr/local/tomcat/webapps/host-manager/META-INF/context.xml
```

#### Nginx Container
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://tomcat:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Docker Compose Configuration
```yaml
version: '3.8'
services:
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - tomcat

  tomcat:
    build: 
      context: ./tomcat
      dockerfile: Dockerfile
    depends_on:
      - mysql
    environment:
      - MYSQL_HOST=mysql
      - MYSQL_PORT=3306
      - MYSQL_DATABASE=logindb
      - MYSQL_USER=loginuser
      - MYSQL_PASSWORD=loginpass

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: logindb
      MYSQL_USER: loginuser
      MYSQL_PASSWORD: loginpass
      MYSQL_ROOT_PASSWORD: rootpass
    volumes:
      - mysql-data:/var/lib/mysql
      - ./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql

volumes:
  mysql-data:
```

### 4. Deployment Workflow

#### Build and Run
```bash
# Construir e iniciar os containers
docker-compose up --build -d

# Verificar status dos containers
docker-compose ps

# Parar e remover containers
docker-compose down
```

### 5. Desafios e Soluções

#### Gerenciamento de Dependências
- Utilizei `depends_on` para garantir a ordem de inicialização dos containers
- Implementei scripts de inicialização para configuração do banco de dados
- Adicionei verificações de saúde para garantir a disponibilidade dos serviços

#### Configurações de Segurança
- Senhas definidas como variáveis de ambiente
- Volumes separados para persistência de dados
- Configurações mínimas de segurança no Nginx e Tomcat

### 6. Considerações Finais

#### Benefícios da Arquitetura
- **Escalabilidade**: Fácil adição ou remoção de containers
- **Portabilidade**: Ambiente consistente em diferentes máquinas
- **Isolamento**: Cada serviço em seu próprio container
- **Facilidade de Manutenção**: Configurações centralizadas no `docker-compose.yml`

### Repositório
Confira o código completo no GitHub: [Java Login App Docker Compose](https://github.com/BrendoTrindade/java-login-docker)

### Tecnologias Utilizadas
- Docker
- Docker Compose
- Java
- Tomcat
- Nginx
- MySQL
- AWS (opcional)
