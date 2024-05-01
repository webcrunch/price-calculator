let total = 0;
let priceArray = []
const totalElement = document.getElementById('total');
const itemList = document.getElementById('item-list');

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


document.getElementById('clear').addEventListener('click', () => {
    priceArray = []
    displayItemList()
});

const setPrice = () => {
    let total = priceArray.reduce((sum, item) => sum + Number(item.price), 0);
    totalElement.innerText = 'Totally: ' + total + " ₱";
}
