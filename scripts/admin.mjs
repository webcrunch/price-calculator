import { buttonArray } from "./arrays.mjs";
import { dataFetch } from "./fetchData.mjs";
import { query_selector_handling } from './extern.mjs';
import { toggle } from './menu-handling.mjs';
const buttonContainer = document.getElementById('button-container');

const displayButtons = () => {
    buttonContainer.innerHTML = ""
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
    toggle()
    displayButtons()

    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', event => {
            const buttons = JSON.parse(localStorage.getItem('buttons'))
            let obj = buttons.find(a => a.name == event.target.innerText)
            query_selector_handling(".update-menu").classList.remove("hidden")
            query_selector_handling(".update-menu").classList.add('showB')
            query_selector_handling(".add-menu").classList.remove("showB")
            query_selector_handling(".add-menu").classList.add('hidden')

            document.getElementById('nameU').value = obj.name;
            document.getElementById('priceU').value = obj.price;
            document.getElementById('id').value = obj._id;

        });
    });

    document.getElementById('update-menu').addEventListener('click', async () => {
        const inputObj = {
            "name": document.getElementById('nameA').value,
            "price": document.getElementById('priceA').value
        }

    });
    document.getElementById('add-menu').addEventListener('click', async () => {

        const inputObj = {
            "name": document.getElementById('nameA').value,
            "price": document.getElementById('priceA').value
        }


        const response = await fetch('https://backend-price.netlify.app/.netlify/functions/api/button', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Sätt rätt Content-Type
            },
            body: JSON.stringify([inputObj]), // Konvertera data till JSON-sträng
        });
        if (response.ok) {
            const buttons = await response.json();
            localStorage.removeItem("buttons");
            localStorage.setItem('buttons', JSON.stringify(buttons));
        } else {
            console.error('Något gick fel');
        }
        //     priceArray = []
        displayButtons()
    });

    document.getElementById('update-menu').addEventListener('click', async () => {
        const id = document.getElementById('id').value
        const inputObj = {
            "name": document.getElementById('nameU').value,
            "price": document.getElementById('priceU').value
        }

        const response = await fetch(`https://backend-price.netlify.app/.netlify/functions/api/button/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Sätt rätt Content-Type
            },
            body: JSON.stringify(inputObj), // Konvertera data till JSON-sträng
        });
        if (response.ok) {
            const buttons = await response.json();
            localStorage.removeItem("buttons");
            localStorage.setItem('buttons', JSON.stringify(buttons));
        } else {
            console.error('Något gick fel');
        }
    });


    document.getElementById('delete-menu').addEventListener('click', async () => {
        const id = document.getElementById('id').value
        const inputObj = {
            "name": document.getElementById('nameU').value,
            "price": document.getElementById('priceU').value
        }

        const response = await fetch(`https://backend-price.netlify.app/.netlify/functions/api/button/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Sätt rätt Content-Type
            },
            body: JSON.stringify(inputObj), // Konvertera data till JSON-sträng
        });
        if (response.ok) {
            const buttons = await response.json();
            localStorage.removeItem("buttons");
            localStorage.setItem('buttons', JSON.stringify(buttons));
        } else {
            console.error('Något gick fel');
        }
    });


    document.addEventListener('click', function (event) {
        // Kolla om klicket inte var på en knapp eller input-fält
        if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
            // Här kan du lägga till din egen logik
            query_selector_handling(".add-menu").classList.remove("hidden")
            query_selector_handling(".add-menu").classList.add('showB')
            query_selector_handling(".update-menu").classList.remove("showB")
            query_selector_handling(".update-menu").classList.add('hidden')
        }
    });

}

document.addEventListener('DOMContentLoaded', fetchData);
