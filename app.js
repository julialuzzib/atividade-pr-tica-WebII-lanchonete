// public/app.js

const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const orderForm = document.getElementById('orderForm');
const ordersContainer = document.getElementById('orders-container');
const itemSelect = document.getElementById('itemSelect');

//ws 
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const ws = new WebSocket(`${protocol}://${window.location.host}`);

ws.onopen = () => {
    statusDot.classList.replace('red', 'green');
    statusText.innerText = 'Conectado em Tempo Real';
};

ws.onclose = () => {
    statusDot.classList.replace('green', 'red');
    statusText.innerText = 'Desconectado';
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'NEW_ORDER') renderOrder(data.payload);
    if (data.type === 'ORDER_UPDATED') updateOrderUI(data.payload);
    if (data.type === 'STOCK_UPDATE') {
        updateStockUI(data.payload);
    }
};

async function loadMenu() {
    const res = await fetch('/api/menu');
    const menu = await res.json();
    itemSelect.innerHTML = ''; 
    menu.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.id = `opt-item-${item.id}`;
        option.innerText = `${item.name} (${item.stock} un.)`;
        option.disabled = item.stock <= 0;
        itemSelect.appendChild(option);
    });
}

function updateStockUI(item) {
    const option = document.getElementById(`opt-item-${item.id}`);
    if (option) {
        option.innerText = `${item.name} (${item.stock} un.)`;
        option.disabled = item.stock <= 0;
        //se acabou estoque não pode selecionar item
        if (item.stock <= 0 && itemSelect.value == item.id) {
            itemSelect.value = "";
        }
    }
}

//iniciar com pedidos
async function loadInitialOrders() {
    const response = await fetch('/api/orders');
    const orders = await response.json();
    orders.forEach(order => renderOrder(order));
}

//add novo pedido
orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const clientName = document.getElementById('clientName').value;
    const itemId = itemSelect.value;

    await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientName, itemId })
    });
    orderForm.reset();
});


function renderOrder(order) {
    if (document.getElementById(`order-caixa-${order.id}`)) return;

    const card = document.createElement('div');
    card.id = `order-caixa-${order.id}`; 
    card.className = `order-card ${order.status === 'Pronto' ? 'ready' : ''}`;
    
    card.innerHTML = `
        <h3>Pedido #${order.id}</h3>
        <p><strong>Cliente:</strong> ${order.clientName}</p>
        <p><strong>Item:</strong> ${order.itemDescription}</p>
        <p><small class="status-label">Status: ${order.status}</small></p>
    `;
    ordersContainer.prepend(card);
}

//atualiza se cozinha marca OK
function updateOrderUI(order) {
    const card = document.getElementById(`order-caixa-${order.id}`);
    if (card) {
        card.classList.add('ready'); 
        const label = card.querySelector('.status-label');
        if (label) label.innerText = `Status: ${order.status}`;
    }
}

loadInitialOrders();
loadMenu();