import { toggle } from './menu-handling.mjs';
import { removeItemsFromArray, updateHistory, get_data, singleItemFromArray } from "./historyHandling.mjs"

const ordersDiv = document.getElementById('orders');
const totalDiv = document.getElementById('total');
const OrderDiv = document.getElementById('order');
// const itemsDiv = document.getElementById('items');

// Sätt dagens datum som standardvärde för datumväljaren
const datumValjare = document.getElementById('datumValjare');
const today = new Date().toISOString().split('T')[0];
let dateOfChoose;
datumValjare.value = today;


const displayOrders = date => {
    const orders = JSON.parse(localStorage.getItem('OrderHistory')) || [];
    const totalAmount = orders.reduce((accumulator, currentOrder) => {
        return accumulator + currentOrder.totalPrice;
    }, 0);
    dateOfChoose = date;
    ordersDiv.innerHTML = ''; // Töm innehållet
    OrderDiv.innerHTML = '';
    const itemsList = [];
    let totalSum = 0;
    let filteredOrders = orders.filter(order => order.date === date);
    filteredOrders.forEach(order => {
        const buttonOrder = document.createElement('button');

        // Sätt texten på knappen till 'name'
        buttonOrder.innerText = "Change Order";

        // Sätt värdet på knappen till 'price'
        buttonOrder.id = order._id;
        // Lägg till en klass till knappen
        buttonOrder.classList.add('button');
        const button = document.createElement('button');

        // Sätt texten på knappen till 'name'
        button.innerText = "remove order";

        // Sätt värdet på knappen till 'price'
        button.id = order._id;
        // Lägg till en klass till knappen
        button.classList.add('button');
        buttonOrder.addEventListener('click', async function (event) {
            event.preventDefault();
            let a = await singleItemFromArray(this.id)
            displayAOrder(a)
        });
        button.addEventListener('click', function (event) {
            event.preventDefault();
            removeItemsFromArray(this.id);
            displayOrders(dateOfChoose)
        });
        const orderContainer = document.createElement('div');
        orderContainer.appendChild(buttonOrder)
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

const displayAOrder = order => {
    const buttonContainer = document.getElementById('button-container');
    console.log(buttonContainer)
    // const buttons = JSON.parse(localStorage.getItem('buttons'))
    // let buttonA = buttons.length > 0 ? buttons : buttonArray
    // buttonA.forEach(item => {
    //     // Skapa en ny knapp
    //     const button = document.createElement('button');

    //     // Sätt texten på knappen till 'name'
    //     button.innerText = item.name;

    //     // Sätt värdet på knappen till 'price'
    //     button.value = item.price;

    //     // Lägg till en klass till knappen
    //     button.classList.add('button');

    //     // Lägg till knappen till container-elementet
    //     buttonContainer.appendChild(button);
    // });
    const price = document.createElement('input');
    price.value = order.totalPrice
    ordersDiv.appendChild(price)

}


document.querySelector("#clear_cache").addEventListener("click", () => clear_cache())

datumValjare.addEventListener('change', function () {
    displayOrders(this.value)
});

document.addEventListener('DOMContentLoaded', async function () {
    toggle()
    await get_data()
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