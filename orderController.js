const OrderModel = require('../models/OrderModel');
const WebSocket = require('ws');

const OrderController = {
    getOrders: (req, res) => res.json(OrderModel.getAllOrders()),
    getMenu: (req, res) => res.json(OrderModel.getMenu()), // NOVO

    createOrder: (req, res, wss) => {
        const { clientName, itemId } = req.body;
        const result = OrderModel.addOrder(clientName, itemId);

        if (result) {
            //aviso novo pedido e mudança estoque
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'NEW_ORDER', payload: result.newOrder }));
                    client.send(JSON.stringify({ type: 'STOCK_UPDATE', payload: result.updatedItem }));
                }
            });
            return res.status(201).json(result.newOrder);
        }
        res.status(400).json({ error: 'Item esgotado ou inválido' });
    },

    updateStatus: (req, res, wss) => {
        const updatedOrder = OrderModel.updateStatus(req.params.id, req.body.status);
        if (updatedOrder) {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'ORDER_UPDATED', payload: updatedOrder }));
                }
            });
            return res.json(updatedOrder);
        }
        res.status(404).send();
    },

    //atualização de estoque pela cozinha
    updateStock: (req, res, wss) => {
        const updatedItem = OrderModel.updateStock(req.params.id, req.body.stock);
        if (updatedItem) {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'STOCK_UPDATE', payload: updatedItem }));
                }
            });
            return res.json(updatedItem);
        }
        res.status(404).send();
    }
};

module.exports = OrderController;