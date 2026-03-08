const pendingContainer = document.getElementById('pending-orders');
const finishedContainer = document.getElementById('finished-orders');
const stockManager = document.getElementById('stock-manager');

const ws = new WebSocket(`ws://${window.location.host}`);

async function loadStockControl() {
    const res = await fetch('/api/menu');
    const menu = await res.json();
    stockManager.innerHTML = '';
    menu.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <strong>${item.name}:</strong>
            <input type="number" value="${item.stock}" style="width: 50px" 
                   onchange="changeStock(${item.id}, this.value)">
        `;
        stockManager.appendChild(div);
    });
}

async function changeStock(id, newStock) {
    await fetch(`/api/stock/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
    });
}

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'NEW_ORDER') renderOrder(data.payload);
    if (data.type === 'ORDER_UPDATED') moveOrder(data.payload);
    if (data.type === 'STOCK_UPDATE') loadStockControl();
};

async function loadOrders() {
    const res = await fetch('/api/orders');
    const orders = await res.json();
    orders.forEach(renderOrder);
}

function renderOrder(order) {
    const existing = document.getElementById(`order-${order.id}`);
    if (existing) existing.remove();

    const card = document.createElement('div');
    card.id = `order-${order.id}`;
    card.className = `order-card ${order.status === 'Pronto' ? 'ready' : ''}`;
    
    card.innerHTML = `
        <div>
            <h3>#${order.id} - ${order.clientName}</h3>
            <p>${order.itemDescription}</p>
        </div>
        ${order.status === 'Preparando' 
            ? `<button class="btn-ok" onclick="completeOrder(${order.id})">OK (Pronto)</button>` 
            : '<span>PRONTO!</span>'}
    `;

    if (order.status === 'Preparando') {
        pendingContainer.prepend(card);
    } else {
        finishedContainer.prepend(card);
    }
}

async function completeOrder(id) {
    await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Pronto' })
    });
}

//ws para atualizar status do pedido e estoque em tempo real para todos os clientes
function moveOrder(order) {
    renderOrder(order);
}

loadStockControl();
loadOrders();