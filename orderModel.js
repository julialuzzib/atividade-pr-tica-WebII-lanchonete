let orders = [];
let nextId = 1;

let menu = [
    { id: 1, name: 'Torta de Maçã 🍎', stock: 4 },
    { id: 2, name: 'Bolo de Chocolate 🎂 ', stock: 5 },
    { id: 3, name: 'Suco de Laranja 🍊', stock: 2 },
    { id: 4, name: 'Café ☕', stock: 10 },
    { id: 5, name: 'Sanduíche Natural 🥪', stock: 3 },
    { id: 6, name: 'Salada de Frutas 🍓', stock: 6 },
    { id: 7, name: 'Pão de Queijo 🧀', stock: 8 },
    { id: 8, name: 'Croissant 🥐', stock: 7 },
    { id: 9, name: 'Chá Gelado 🍹', stock: 5 }
];

const OrderModel = {
    getAllOrders: () => orders,
    getMenu: () => menu, 
    
    addOrder: (clientName, itemId) => {
        const menuItem = menu.find(item => item.id === parseInt(itemId));
        if (!menuItem || menuItem.stock <= 0) return null;

        //atualização do estoque ao criar pedido
        menuItem.stock--;

        const newOrder = {
            id: nextId++,
            clientName,
            itemDescription: menuItem.name,
            status: 'Preparando',
            timestamp: new Date().toLocaleTimeString()
        };
        orders.push(newOrder);
        return { newOrder, updatedItem: menuItem };
    },

    updateStatus: (id, newStatus) => {
        const order = orders.find(o => o.id === parseInt(id));
        if (order) { order.status = newStatus; return order; }
        return null;
    },

    //estoque cozinha
    updateStock: (id, quantity) => {
        const item = menu.find(i => i.id === parseInt(id));
        if (item) {
            item.stock = parseInt(quantity);
            return item;
        }
        return null;
    }
};

module.exports = OrderModel;