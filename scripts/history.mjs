import { toggle } from './menu-handling.mjs';
import { removeItemsFromArray, updateHistory, get_data, singleItemFromArray, UpdateItemsFromArray } from "./historyHandling.mjs"
import { query_selector_handling, get_element_id, create_element } from './extern.mjs';

const ordersDiv = get_element_id('orders');
const totalDiv = get_element_id('total');
const OrderDiv = get_element_id('order');
const closingModal = get_element_id('closeModal')
const UpdateList = [];
const myModal = get_element_id("myModal")
const modalContent = query_selector_handling(".modal-content")
// Sätt dagens datum som standardvärde för datumväljaren
const datumValjare = get_element_id('datumValjare');
const today = new Date().toISOString().split('T')[0];
let dateOfChoose;
datumValjare.value = today;
datumValjare.setAttribute('max', today);

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
        const buttonOrder = create_element('button');

        // Sätt texten på knappen till 'name'
        buttonOrder.innerText = "Change Order";

        // Sätt värdet på knappen till 'price'
        buttonOrder.id = order._id;
        // Lägg till en klass till knappen
        buttonOrder.classList.add('my-button');
        buttonOrder.classList.add('primary-button')
        const button = create_element('button');

        // Sätt texten på knappen till 'name'
        button.innerText = "remove order";

        // Sätt värdet på knappen till 'price'
        button.id = order._id;
        // Lägg till en klass till knappen
        button.classList.add('my-button');
        button.classList.add('secondary-button')
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
        const orderContainer = create_element('div');
        orderContainer.appendChild(buttonOrder)
        orderContainer.appendChild(button);
        orderContainer.classList.add('order-container');

        const dateElement = create_element('p');
        dateElement.textContent = 'Date: ' + order.date;
        orderContainer.appendChild(dateElement);

        const totalPriceElement = create_element('p');
        totalPriceElement.textContent = 'Total Price:  ₱ ' + order.totalPrice;
        orderContainer.appendChild(totalPriceElement);

        const itemsElement = create_element('ul');
        order.items.forEach(item => {
            const listItem = create_element('li');
            listItem.textContent = item.item + ' (' + item.price + ')';
            itemsElement.appendChild(listItem);
            itemsList.push(item.item);
        });
        orderContainer.appendChild(itemsElement);

        ordersDiv.appendChild(orderContainer);

        totalSum += order.totalPrice;
    });


    totalDiv.textContent = `Total sum of all orders : ₱ ${totalSum} . Orders for all time is : ₱ ${totalAmount} `;

}

const openModal = org => {
    const buttons = JSON.parse(localStorage.getItem('buttons'))
    let buttonA = buttons.length > 0 ? buttons : []
    buttonA.forEach(item => {
        // Skapa en ny knapp
        const button = create_element('button');
        // const orderId = id;
        // Sätt texten på knappen till 'name'
        button.innerText = item.name;
        button.name = org.target.name
        // Sätt värdet på knappen till 'price'
        button.value = item.price;

        // Lägg till en klass till knappen
        button.classList.add('button');
        button.addEventListener("click", function (event) { addItemToElement(event) })
        // Lägg till knappen till container-elementet
        modalContent.appendChild(button);
    });
    myModal.style.display = "block";
}

const addItemToElement = event => {

    const order_history = JSON.parse(localStorage.getItem('OrderHistory'))
    let filteredOrders = order_history.filter(order => order._id === event.target.name);
    filteredOrders = filteredOrders[0]
    UpdateList.push({ "item": event.target.innerText, "price": event.target.value })
    filteredOrders.items = filteredOrders.items.concat(UpdateList)
    displayAOrder(filteredOrders)
}

const closeModal = () => {
    myModal.style.display = "none";
}


const removeFromItemArray = (id, obj) => {
    obj.items.splice(id, 1)
    displayAOrder(obj)
}

const updateOrder = async order => {
    const id = order._id;
    delete order["_id"]
    await UpdateItemsFromArray(id, order)
    OrderDiv.innerHTML = '';
    displayOrders(dateOfChoose)
}

const displayAOrder = order => {
    OrderDiv.innerHTML = '';
    const itemsList = [];
    const totalPrice = order.items.reduce((sum, item) => sum + Number(item.price), 0);
    const orderContainer = create_element('div');

    orderContainer.classList.add('order-container');
    const buttonU = create_element('button');
    buttonU.id = "upp-order";
    // Sätt texten på knappen till 'name'
    buttonU.innerText = "Update Order";
    const button = create_element('button');
    button.id = "add-order";

    buttonU.addEventListener('click', () => updateOrder(order));
    button.name = order._id
    // Sätt texten på knappen till 'name'
    button.innerText = "Add Order";
    button.addEventListener('click', function (event) { openModal(event) });
    const titleElement = create_element('p');
    titleElement.textContent = 'Remove or add items to the order ';
    const PriceElement = create_element('p');
    PriceElement.textContent = 'Total Price for order:   ₱' + totalPrice;
    const dateElement = create_element('p');
    dateElement.textContent = 'Date: ' + order.date;
    const itemsElement = create_element('ul');
    order.items.forEach((item, i) => {
        const obj = order;
        const listItem = create_element('li');
        listItem.textContent = item.item + ' (' + item.price + ')';
        listItem.id = i;
        itemsElement.appendChild(listItem);

        itemsList.push(item.item);
        listItem.addEventListener('click', function (event) {
            event.preventDefault();
            removeFromItemArray(this.id, obj);
        });
    });
    orderContainer.appendChild(titleElement)
    orderContainer.appendChild(PriceElement)
    orderContainer.appendChild(dateElement)
    orderContainer.appendChild(button)
    orderContainer.appendChild(buttonU)
    orderContainer.appendChild(itemsElement);
    OrderDiv.appendChild(orderContainer)

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
closingModal.addEventListener("click", () => closeModal())

setInterval(updateHistory, 3600000);