//configura ws e rotas
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const OrderController = require('./controllers/OrderController');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

//rotas/controllers
app.get('/api/orders', OrderController.getOrders);
app.get('/api/menu', OrderController.getMenu); 
app.post('/api/orders', (req, res) => OrderController.createOrder(req, res, wss));
app.patch('/api/orders/:id', (req, res) => OrderController.updateStatus(req, res, wss));
app.patch('/api/stock/:id', (req, res) => OrderController.updateStock(req, res, wss)); 

//ws e logs (bônus)
wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`[LOG] Novo cliente conectado! IP: ${ip}. Total de clientes: ${wss.clients.size}`);

    ws.on('close', () => {
        console.log(`[LOG] Cliente desconectado. Total de clientes: ${wss.clients.size}`);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});