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