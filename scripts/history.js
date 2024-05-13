const orders = JSON.parse(localStorage.getItem('OrderHistory')) || [];
const ordersDiv = document.getElementById('orders');
const totalDiv = document.getElementById('total');
const itemsDiv = document.getElementById('items');
// Sätt dagens datum som standardvärde för datumväljaren
const datumValjare = document.getElementById('datumValjare');
const today = new Date().toISOString().split('T')[0];
datumValjare.value = today;
const totalAmount = orders.reduce((accumulator, currentOrder) => {
    return accumulator + currentOrder.totalPrice;
}, 0);


const displayOrders = date => {
    ordersDiv.innerHTML = ''; // Töm innehållet
    const itemsList = [];
    let totalSum = 0;
    let filteredOrders = orders.filter(order => order.date === date);
    filteredOrders.forEach(order => {
        const orderContainer = document.createElement('div');
        orderContainer.classList.add('order-container');

        const dateElement = document.createElement('p');
        dateElement.textContent = 'Date: ' + order.date;
        orderContainer.appendChild(dateElement);

        const totalPriceElement = document.createElement('p');
        totalPriceElement.textContent = 'Total Price: ' + order.totalPrice;
        orderContainer.appendChild(totalPriceElement);

        const itemsElement = document.createElement('ul'); // Skapa en <ul> för items
        order.items.forEach(item => {
            const listItem = document.createElement('li'); // Skapa en <li> för varje item
            listItem.textContent = item.item + ' (' + item.price + ')';
            itemsElement.appendChild(listItem); // Lägg till <li> i <ul>
            itemsList.push(item.item);
        });
        orderContainer.appendChild(itemsElement); // Lägg till <ul> i orderContainer

        ordersDiv.appendChild(orderContainer);

        totalSum += order.totalPrice;
    });


    totalDiv.textContent = `Total sum of all orders: ${totalSum} ₱. Orders for all time is:  ${totalAmount} ₱`;

}

datumValjare.addEventListener('change', function () {
    displayOrders(this.value)
});

document.addEventListener('DOMContentLoaded', function () {
    displayOrders(datumValjare.value)
    const anchors = document.getElementsByTagName('a');
    const domain = window.location.hostname;
    if (domain.includes("github.io")) { // Byt ut mot din GitHub Pages-domän
        var repoName = 'price-calculator'; // Byt ut mot ditt repositoriums namn
        for (var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            if (anchor.pathname.startsWith('/')) {
                anchor.pathname = '/' + repoName + anchor.pathname;
            }
        }
    }
});