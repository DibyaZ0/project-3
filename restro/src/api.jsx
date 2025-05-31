
import { API_BASE_URL } from './config';

export async function getTables() {
    const res = await fetch(API_BASE_URL + "/tables/", {
      method: 'GET'
    })
    return res.json();
}

export async function getAnalytics() {
  const res = await fetch(`${API_BASE_URL}/analytics`, {
    method: 'GET',
    headers: { 'Accept': '*/*' }
  });
  return res.json();
}

export async function getAnalyticsSummary(filterData) {
  const res = await fetch(`${API_BASE_URL}/analyticsSummary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({"filter": filterData})
  });
  const data = await res.json();
  console.log('Analytics summary fetched', res.json);
  return data;
}

export async function createTable(tableRecord) {
    const res = await fetch(API_BASE_URL + "/tables/", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tableRecord)
    })
    const data = await res.json();
    console.log('After fetch the table record', res.json);
    return data;
}
export async function getChefs() {
  const res = await fetch(`${API_BASE_URL}/chefs`, {
    method: 'GET'
  });
  return res.json();
}
export async function deleteTable(tableId) {
  const res = await fetch(`${API_BASE_URL}/tables/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: tableId })
  });
  return res.json();
}


  export async function getOrders() {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return res.json();
  }

// export const getOrders = async () => {
//   const response = await fetch('/api/orders');
//   const data = await response.json();
//   console.log('Fetched data:', data); // Add this log

//   return data; // This must be an array
// };



export async function saveOrder(orderData) {
  console.log("Saving order data:", orderData);
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  return res.json();
}

export async function updateOrder(orderId) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: null
  });
  return res.json();
}