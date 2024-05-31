import { buttonArray } from "./arrays.mjs";
import { dataFetch } from "./fetchData.mjs";
import { query_selector_handling } from './extern.mjs';

let priceArray = []
const totalElement = document.getElementById('total');
const itemList = document.getElementById('item-list');
const paymentElement = document.getElementById('customerPayment');
const changeElement = document.getElementById('change');
const buttonContainer = document.getElementById('button-container');
const checkbox = document.getElementById('change_date');
const datumValjare = document.getElementById('datumValjare');
const today = new Date().toISOString().split('T')[0];
let dateOfChoose;
datumValjare.value = today;
datumValjare.setAttribute('max', today);

const setPrice = () => {
    let total = priceArray.reduce((sum, item) => sum + Number(item.price), 0);
    totalElement.innerText = `Totally: ₱ ${total}`;
}

const removeItemsFromArray = (e) => {
    priceArray.splice(e, 1)
    displayItemList()
}

const displayItemList = () => {
    itemList.innerHTML = ""

    priceArray.map((item, i) => {
        const listItem = document.createElement('li');
        listItem.id = i
        listItem.innerText = item.item + " (" + item.price + ") ₱";
        listItem.addEventListener('click', function () {
            removeItemsFromArray(this.id);
        });
        itemList.appendChild(listItem);
    });
    setPrice()
}

const displayButtons = () => {
    // Loopa igenom arrayen
    const buttons = JSON.parse(localStorage.getItem('buttons'))
    let buttonA = buttons.length > 0 ? buttons : buttonArray
    buttonA.forEach(item => {
        // Skapa en ny knapp
        const button = document.createElement('button');

        // Sätt texten på knappen till 'name'
        button.innerText = item.name;

        // Sätt värdet på knappen till 'price'
        button.value = item.price;

        // Lägg till en klass till knappen
        button.classList.add('button');

        // Lägg till knappen till container-elementet
        buttonContainer.appendChild(button);
    });
}

async function fetchData() {
    await dataFetch()
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

    init()
}

const init = () => {

    displayButtons()
    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', event => {
            priceArray.push({ "item": event.target.innerText, "price": event.target.value })
            displayItemList()
        });
    });

    checkbox.addEventListener("change", function () {
        if (this.checked) {
            query_selector_handling(".show_datepicker").classList.remove("hidden")
            query_selector_handling(".show_datepicker").classList.add('show')
            datumValjare
        } else {
            query_selector_handling(".show_datepicker").classList.remove("show")
            query_selector_handling(".show_datepicker").classList.add('hidden')
        }
    })

    document.getElementById('order').addEventListener('click', async () => {
        const savedData = JSON.parse(localStorage.getItem('OrderHistory')) || [];
        const totalPrice = priceArray.reduce((sum, item) => sum + Number(item.price), 0);


        const inputObj = {
            date: !checkbox.checked ? new Date().toJSON().slice(0, 10) : datumValjare.value,
            "totalPrice": totalPrice,
            "items": priceArray
        }

        savedData.push(inputObj);

        const response = await fetch('https://backend-price.netlify.app/.netlify/functions/api/orderhistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Sätt rätt Content-Type
            },
            body: JSON.stringify([inputObj]), // Konvertera data till JSON-sträng
        });
        if (response.ok) {
            const orders = await response.json();
            localStorage.setItem('OrderHistory', JSON.stringify(orders));
        } else {
            console.error('Något gick fel');
        }
        priceArray = []
        displayItemList()
    });

    paymentElement.addEventListener('input', function () {
        // Hämta värdena
        const totalPrice = priceArray.reduce((sum, item) => sum + Number(item.price), 0);
        let payment = parseInt(paymentElement.value);

        // Utför beräkningen
        let change = payment - totalPrice < 0 ? 0 : payment - totalPrice;

        // Uppdatera texten i det andra elementet
        changeElement.textContent = `Payment back to customer: ₱ ${change}`;
    });

    document.getElementById('clear').addEventListener('click', () => {
        priceArray = []
        displayItemList()
    });

}

document.addEventListener('DOMContentLoaded', fetchData);
