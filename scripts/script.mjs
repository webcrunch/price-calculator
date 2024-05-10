import { buttonArray } from "./arrays.mjs";
let total = 0;
let priceArray = []
const totalElement = document.getElementById('total');
const itemList = document.getElementById('item-list');
const paymentElement = document.getElementById('customerPayment');
const changeElement = document.getElementById('change');
const buttonContainer = document.getElementById('button-container');
const savedArrayData = []
const buttonArray_Fetch = []


const setPrice = () => {
    let total = priceArray.reduce((sum, item) => sum + Number(item.price), 0);
    totalElement.innerText = 'Totally: ' + total + " ₱";
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

const displayButtions = () => {
    // Loopa igenom arrayen
    let buttonA = buttonArray_Fetch.length > 0 ? buttonArray_Fetch : buttonArray
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

// Asynkron funktion för att hämta data från ett externt API
async function fetchData() {
    const anchors = document.getElementsByTagName('a');
    const domain = window.location.hostname;

    if (!domain.includes("github.io")) { // Byt ut mot din GitHub Pages-domän
        var repoName = 'webcrunch'; // Byt ut mot ditt repositoriums namn
        for (var i = 0; i < anchors.length; i++) {
            var anchor = anchors[i];
            if (anchor.pathname.startsWith('/')) {
                anchor.pathname = '/' + repoName + anchor.pathname;
            }
        }
    }

    try {
        const response = await fetch('https://backend-price.netlify.app/.netlify/functions/api/buttons');
        const data = await response.json();
    } catch (error) {
        console.error('Det gick inte att hämta data:', error);
    }

    init()
}


const push = () => { }


const init = () => {

    displayButtions()


    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', event => {
            priceArray.push({ "item": event.target.innerText, "price": event.target.value })
            displayItemList()
        });
    });

    document.getElementById('order').addEventListener('click', async () => {
        const savedData = JSON.parse(localStorage.getItem('OrderHistory'));
        const totalPrice = priceArray.reduce((sum, item) => sum + Number(item.price), 0);
        savedArrayData.push({ date: new Date().toJSON().slice(0, 10), "totalPrice": totalPrice, "items": priceArray })
        // console.log(savedArrayData, totalPrice, savedArrayData)
        let addOrderHistoryArry;
        // savedData !== null ? addOrderHistoryArry = [...savedArrayData, savedData] : addOrderHistoryArry = savedArrayData

        console.log(JSON.stringify(savedArrayData))
        const response = await fetch('https://backend-price.netlify.app/.netlify/functions/api/orderhistory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Sätt rätt Content-Type
            },
            body: JSON.stringify(savedArrayData), // Konvertera data till JSON-sträng
        });
        if (response.ok) {
            localStorage.setItem('OrderHistory', JSON.stringify(savedArrayData));
            console.log(response);
        } else {
            console.error('Något gick fel');
        }
        // const response = await fetch('https://backend-price.netlify.app/.netlify/functions/api/buttons');

        // let updateResult = await push()
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
        changeElement.textContent = 'Payment back to customer: ' + change + ' ₱';
    });

    document.getElementById('clear').addEventListener('click', () => {
        priceArray = []
        displayItemList()
    });

}

document.addEventListener('DOMContentLoaded', fetchData);
