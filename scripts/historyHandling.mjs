import { dataFetch, fetchHistory } from "./fetchData.mjs";

export const removeItemsFromArray = async (e) => {
    if (e !== undefined) {
        const response = await fetch(`https://backend-price.netlify.app/.netlify/functions/api/orderhistory/${e}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            const updatedHistory = await response.json();
            localStorage.removeItem("OrderHistory");
            localStorage.setItem('OrderHistory', JSON.stringify(updatedHistory));
            return true;
        } else {
            console.error('Något gick fel');
            return false;
        }
    }

}

export const UpdateItemsFromArray = async (id, obj) => {
    if (id !== undefined) {
        const response = await fetch(`https://backend-price.netlify.app/.netlify/functions/api/orderhistory/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Sätt rätt Content-Type
            },
            body: JSON.stringify(obj), // Konvertera data till JSON-sträng

        })
        if (response.ok) {
            localStorage.removeItem("OrderHistory");
            localStorage.setItem('OrderHistory', JSON.stringify((await response.json())));
            return true;
        } else {
            console.error('Något gick fel');
            return false;
        }
    }

}


export const singleItemFromArray = async (e) => {
    if (e !== undefined) {
        const response = await fetch(`https://backend-price.netlify.app/.netlify/functions/api/orderhistory/${e}`, {
            method: 'GET'
        })
        if (response.ok) {
            return await response.json();
        } else {
            return false;
            console.error('Något gick fel');
        }
    }

}

export const get_data = async () => {
    await dataFetch()
}

export const updateHistory = () => {
    fetchHistory()
    displayOrders(dateOfChoose)
}

export const clear_cache = async () => {
    window.localStorage.clear();
    await dataFetch()
}

