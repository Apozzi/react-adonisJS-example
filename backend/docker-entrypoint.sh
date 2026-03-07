#!/bin/sh

# Parar a execução se ocorrer erro em qualquer comando
set -e

echo "Instalando dependências..."
npm install

echo "Rodando migrations do banco..."
node ace migration:run --force

echo "Rodando seeders (com dados iniciais)..."
node ace db:seed

echo "Iniciando o servidor AdonisJS em modo de desenvolvimento..."
npm run dev
