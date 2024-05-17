import { query_selector_handling } from './extern.mjs';

export const dataFetch = async () => {
    const savedData = JSON.parse(localStorage.getItem('OrderHistory'))
    const buttons = JSON.parse(localStorage.getItem('buttons'))
    if (savedData == null || buttons == null) {
        query_selector_handling(".loader").classList.remove("hidden")
        query_selector_handling(".loader").classList.add('show')
        try {
            const orderhistory = await fetch('https://backend-price.netlify.app/.netlify/functions/api/orderhistorys')
            const fetchbuttons = await fetch('https://backend-price.netlify.app/.netlify/functions/api/buttons');
            const data = await fetchbuttons.json();
            localStorage.setItem('buttons', JSON.stringify(data));
            const data_orders = await orderhistory.json();
            query_selector_handling(".loader").classList.remove("show")
            query_selector_handling(".loader").classList.add('hidden')

            localStorage.setItem('OrderHistory', JSON.stringify(data_orders));
        } catch (error) {
            console.error('Det gick inte att hämta data:', error);
        }
    }
    return null;
}

export const fetchHistory = async () => {
    try {
        const orderhistory = await fetch('https://backend-price.netlify.app/.netlify/functions/api/orderhistorys')
        const data_orders = await orderhistory.json();
        localStorage.setItem('OrderHistory', JSON.stringify(data_orders));
    } catch (error) {
        console.error('Det gick inte att hämta data:', error);
    }
}