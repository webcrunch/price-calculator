
let total = 0;
let priceArray = []
const totalElement = document.getElementById('total');
const itemList = document.getElementById('item-list');
const paymentElement = document.getElementById('customerPayment');
const changeElement = document.getElementById('change');

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', event => {
        priceArray.push({ "item": event.target.innerText, "price": event.target.value })
        displayItemList()
    });
});

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


document.getElementById('order').addEventListener('click', () => {
    const savedData = JSON.parse(localStorage.getItem('OrderHistory'));
    const totalPrice = priceArray.reduce((sum, item) => sum + Number(item.price), 0);
    const savedArrayData = [{ "totalPrice": totalPrice, "items": priceArray }]


    let addOrderHistoryArry;
    savedData !== null ? addOrderHistoryArry = [...savedArrayData, savedData] : addOrderHistoryArry = savedArrayData
    localStorage.setItem('OrderHistory', JSON.stringify(addOrderHistoryArry));
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

const setPrice = () => {
    let total = priceArray.reduce((sum, item) => sum + Number(item.price), 0);
    totalElement.innerText = 'Totally: ' + total + " ₱";
}
