import { dataFetch, fetchHistory } from "./fetchData.mjs";
const ordersDiv = document.getElementById('orders');
const totalDiv = document.getElementById('total');
const itemsDiv = document.getElementById('items');
// Sätt dagens datum som standardvärde för datumväljaren
const datumValjare = document.getElementById('datumValjare');
const today = new Date().toISOString().split('T')[0];
let dateOfChoose;
datumValjare.value = today;


const updateHistory = () => {
    fetchHistory()
    displayOrders(dateOfChoose)
}

const clear_cache = async () => {
    window.localStorage.clear();
    await dataFetch()
}


const removeItemsFromArray = async (e) => {
    if (e !== undefined) {
        const response = await fetch(`https://backend-price.netlify.app/.netlify/functions/api/orderhistory/${e}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            const updatedHistory = await response.json();
            localStorage.removeItem("OrderHistory");
            localStorage.setItem('OrderHistory', JSON.stringify(updatedHistory));
            displayOrders(dateOfChoose)
        } else {
            console.error('Något gick fel');
        }
    }

}


const displayOrders = date => {
    const orders = JSON.parse(localStorage.getItem('OrderHistory')) || [];
    const totalAmount = orders.reduce((accumulator, currentOrder) => {
        return accumulator + currentOrder.totalPrice;
    }, 0);
    dateOfChoose = date;
    ordersDiv.innerHTML = ''; // Töm innehållet
    const itemsList = [];
    let totalSum = 0;
    let filteredOrders = orders.filter(order => order.date === date);
    filteredOrders.forEach(order => {
        const button = document.createElement('button');

        // Sätt texten på knappen till 'name'
        button.innerText = "remove order";

        // Sätt värdet på knappen till 'price'
        button.id = order._id;
        // Lägg till en klass till knappen
        button.classList.add('button');
        button.addEventListener('click', function (event) {
            event.preventDefault();
            removeItemsFromArray(this.id);
        });
        const orderContainer = document.createElement('div');
        orderContainer.appendChild(button);
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

document.querySelector("#clear_cache").addEventListener("click", () => clear_cache())

datumValjare.addEventListener('change', function () {
    displayOrders(this.value)
});

document.addEventListener('DOMContentLoaded', async function () {
    await dataFetch()
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
setInterval(updateHistory, 3600000);