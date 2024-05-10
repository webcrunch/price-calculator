
const orders = JSON.parse(localStorage.getItem('OrderHistory')) || [];

// Sätt dagens datum som standardvärde för datumväljaren
const datumValjare = document.getElementById('datumValjare');

const today = new Date().toISOString().split('T')[0];
console.log(today)
datumValjare.value = today;

// Filtrera order baserat på valt datum
let filteredOrders = orders.filter(order => order.date === datumValjare.value);

const ordersDiv = document.getElementById('orders');
const totalDiv = document.getElementById('total');
const itemsDiv = document.getElementById('items');

let totalSum = 0;
const itemsList = [];

filteredOrders.forEach(order => {
    const orderContainer = document.createElement('div');
    orderContainer.classList.add('order-container');

    const dateElement = document.createElement('p');
    dateElement.textContent = 'Date: ' + order.date;
    orderContainer.appendChild(dateElement);

    const totalPriceElement = document.createElement('p');
    totalPriceElement.textContent = 'Total Price: ' + order.totalPrice;
    orderContainer.appendChild(totalPriceElement);

    const itemsElement = document.createElement('p');
    itemsElement.textContent = 'Items: ';
    order.items.forEach(item => {
        itemsElement.textContent += item.item + ' (' + item.price + '), ';
        itemsList.push(item.item);
    });
    itemsElement.textContent = itemsElement.textContent.slice(0, -2);
    orderContainer.appendChild(itemsElement);

    ordersDiv.appendChild(orderContainer);

    totalSum += order.totalPrice;
});

totalDiv.textContent = `Total sum of all orders: ${totalSum} ₱`;

// Lägg till en lyssnare för datumändringar
datumValjare.addEventListener('change', function () {
    filteredOrders = orders.filter(order => order.date === this.value);
    // Uppdatera gränssnittet här baserat på det nya filtreradeOrders
    console.log('Det valda datumet är: ' + this.value);
});

document.addEventListener('DOMContentLoaded', function () {

    const anchors = document.getElementsByTagName('a');
    const domain = window.location.hostname;
    if (domain.includes("github.io")) { // Byt ut mot din GitHub Pages-domän
        var repoName = 'webcrunch'; // Byt ut mot ditt repositoriums namn
        for (var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            if (anchor.pathname.startsWith('/')) {
                anchor.pathname = '/' + repoName + anchor.pathname;
            }
        }
    }
});