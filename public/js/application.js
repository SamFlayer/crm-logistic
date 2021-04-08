const { addNewOrderForm } = document;
let id;

addNewOrderForm?.client?.addEventListener('input', async (e) => {
  // console.log(e.target.value.trim())
  const response = await fetch(`/clients/all/?lastName=${e.target.value}`);
  const allClients = await response.json();
  // console.log(allClients);
  const names = allClients.map((el) => `<p data-id="${el._id}">${el.lastname} ${el.name} ${el.middlename}</p>`).join('');

  let namesDiv = document.querySelector('[data-find]');

  function findNamesOfClients(ev) {
    if (ev.target.dataset.id) {
      e.target.value = ev.target.innerText;
      id = ev.target.dataset.id;
      namesDiv.removeEventListener('click', findNamesOfClients);
      namesDiv.remove();
    }
  }

  if (!namesDiv && names) {
    e.target.insertAdjacentHTML('afterend', `<div data-find>${names}</div>`);
    namesDiv = document.querySelector('[data-find]');
    namesDiv.addEventListener('click', findNamesOfClients);
  } else if (names.length) {
    namesDiv.innerHTML = '';
    namesDiv.insertAdjacentHTML('afterbegin', names);
  } else if (namesDiv && !names.length) {
    namesDiv.remove();
  }
});

addNewOrderForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const {
    title,
    deliveryadress,
    deliverydate,
    assemblydate,
    orderprice,
    payment,
    deliveryprice,
    assemblyprice,
  } = addNewOrderForm;
  const resp = await fetch('/orders/new', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title.value,
      client: id,
      deliveryadress: deliveryadress.value,
      deliverydate: deliverydate.value,
      assemblydate: assemblydate.value,
      orderprice: orderprice.value,
      payment: payment.value,
      deliveryprice: deliveryprice.value,
      assemblyprice: assemblyprice.value,
    }),
  });
  if (resp.status === 200) {
    const orderId = await resp.json();
    window.location.replace(`/orders/${orderId}`);
  }
});

const { addNewOrderForClient } = document.forms;

if (addNewOrderForClient) {
  addNewOrderForClient.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(addNewOrderForClient).entries());
    const response = await fetch('/orders/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      const userOrderId = await response.json();
      console.log('===========', userOrderId);
      window.location.replace(`/orders/${userOrderId}`);
    }
  });
}

const { addCommentClient } = document;
const { addCommentOrder } = document;
const { findClients } = document;
const { findOrders } = document;
const { changeStatus } = document;

addCommentClient?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = addCommentClient.texOfComment.value;
  const { id } = addCommentClient.dataset;
  const response = await fetch(`/clients/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  addCommentClient.texOfComment.value = '';
  if (response.status === 200) {
    const resBody = await response.json();
    const list = document.querySelector('.listOfComment');
    const li = document.createElement('li');
    const div = document.createElement('div');
    if (resBody.isAdmin) {
      div.innerText = `admin: ${resBody.text}`;
    } else div.innerText = `${resBody.lastname} ${resBody.name} ${resBody.middlname}: ${resBody.text}`;
    li.append(div);
    list.appendChild(li);
  }
});

addCommentOrder?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const text = addCommentOrder.texOfComment.value;
  const { id } = addCommentOrder.dataset;
  const response = await fetch(`/orders/${id}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  addCommentOrder.texOfComment.value = '';
  if (response.status === 200) {
    const resBody = await response.json();
    const list = document.querySelector('.listOfComment');
    const li = document.createElement('li');
    const div = document.createElement('div');
    if (resBody.isAdmin) {
      div.innerText = `admin: ${resBody.text}`;
    } else div.innerText = `${resBody.lastname} ${resBody.name} ${resBody.middlname}: ${resBody.text}`;
    li.append(div);
    list.appendChild(li);
  }
});

let timeoutID;

async function checkFiltr() {
  const text = findClients.name.value;
  const response = await fetch('/clients/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const resBody = await response.json();

  const listGroup = document.querySelector('.list-group');
  listGroup.innerHTML = '';
  resBody.clients.forEach((client) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    const a = document.createElement('a');
    a.href = `/clients/${client._id}`;
    a.style.textDecoration = 'none';
    a.innerText = `${client.lastname} ${client.name} ${client.middlename}`;
    const span = document.createElement('span');
    span.classList.add('badge', 'bg-primary', 'rounded-pill');
    span.innerText = client.orders.length;
    li.append(a);
    li.append(span);
    listGroup.append(li);
  });
}

async function checkFiltrByOrder() {
  const text = findOrders.name.value;
  const response = await fetch('/orders/all', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  const resBody = await response.json();

  const listGroup = document.querySelector('.list-group');
  listGroup.innerHTML = '';
  resBody.orders.forEach((order) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.href = `/clients/${order._id}`;
    a.style.textDecoration = 'none';
    a.innerText = `${order.number} ${order.title} ${order.status}`;
    li.append(a);
    listGroup.append(li);
  });
}

function delayFiltr() {
  window.clearTimeout(timeoutID);
  timeoutID = window.setTimeout(checkFiltr, 300);
}

function delayFiltrByOrder() {
  window.clearTimeout(timeoutID);
  timeoutID = window.setTimeout(checkFiltrByOrder, 300);
}

findClients?.addEventListener('input', delayFiltr);
findOrders?.addEventListener('input', delayFiltrByOrder);

changeStatus?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = changeStatus.statusSelect.value;
  console.log(status);
  const response = await fetch(`/orders/${changeStatus.dataset.id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  // const resBody = await response.json();
  if (response.status === 200) {
    document.getElementById('status').innerHTML = `Текущий статус: ${status}`;
  }
});
