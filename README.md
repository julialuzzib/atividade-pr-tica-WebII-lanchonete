# atividade-pr-tica-WebII-lanchonete
Atividade Prática - Comunicação Cliente/Servidor - Comércio: Lanchonete

# 🍔 Lanchonete Real-Time (WebSocket)
Este projeto simula o fluxo de pedidos de uma lanchonete em tempo real, conectando a frente de caixa à cozinha e ao controle de estoque de forma instantânea.

# Como Executar o Projeto
Instalar Dependências:
Abra o terminal na pasta do projeto e execute:

# Bash
npm install
Iniciar o Servidor:

# Bash
node server.js
Você verá a mensagem: Servidor rodando na porta http://localhost:3000

## Acessar as Interfaces:
Para testar a comunicação bidirecional, abra as URLs abaixo em abas diferentes (ou navegadores diferentes):

Visão do Caixa: http://localhost:3000/index.html

Visão da Cozinha: http://localhost:3000/cozinha.html

## 🛠 Funcionalidades e Testes
Ao abrir as abas, você notará os logs de conexão no terminal:

[LOG] Novo cliente conectado! IP: ::1. Total de clientes: 1
[LOG] Novo cliente conectado! IP: ::1. Total de clientes: 2

### O que testar:
Fluxo de Pedido: No Caixa, selecione um produto e envie. Ele aparecerá instantaneamente na Cozinha sem F5.

Gestão de Status: Na Cozinha, clique em "OK (Pronto)". O pedido mudará de cor automaticamente na tela do Caixa.

Controle de Estoque Inteligente: Cada pedido realizado subtrai uma unidade do estoque.

Se o estoque chegar a zero, o item fica desabilitado no Caixa em tempo real.

A Cozinha pode repor o estoque manualmente, habilitando o item para o Caixa imediatamente.

Indicador de Conexão: Note o "LED" visual no topo das páginas que indica se o WebSocket está ativo (Verde) ou se o servidor caiu (Vermelho).

## 🏗 Arquitetura do Projeto
O sistema foi desenvolvido utilizando o padrão MVC (Model-View-Controller) para garantir a organização do código:

models/: Gerencia os dados (pedidos e menu) em memória.

controllers/: Contém a lógica de negócio e as rotas da API.

public/: Contém o Frontend (HTML, CSS e o JS do lado do cliente).

server.js: Ponto de entrada que integra o Express e o Servidor WebSocket.

## 💻 Tecnologias Utilizadas
Node.js e Express para o Backend.

WS (WebSocket) para comunicação persistente e bidirecional.

JavaScri, HTML5 e CSS3 para o Frontend.
