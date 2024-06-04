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
            return false;
            console.error('Något gick fel');
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

