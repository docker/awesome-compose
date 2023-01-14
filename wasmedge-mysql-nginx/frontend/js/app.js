(function() {
  let orders = null;
  const appLoadingEle = document.getElementById("app-loading-display");
  const orderWrapperEle = document.getElementById("order-display");
  const orderEmptyTextEle = document.getElementById("order-empty-text");
  const orderTableEle = document.getElementById("order-table");
  const orderTableBodyEle = document.querySelector("#order-table tbody");
  const addOrderEle = document.getElementById("add-order-wrapper");
  const addOrderForm = document.getElementById("add-order-form");

  const orderIdField = document.getElementById("order-id");
  const productIdField = document.getElementById("product-id");
  const quantityField = document.getElementById("quantity");
  const amountField = document.getElementById("amount");
  const taxField = document.getElementById("tax");
  const shippingField = document.getElementById("shippingAmount");
  const shippingAddressField = document.getElementById("shippingAddress");

  function fetchOrders() {
    fetch("http://localhost:8080/orders")
      .then(r => r.json())
      .then(r => orders = r)
      .then(renderOrders)
      .catch((e) => {
        init();
      });
  }

  function init() {
    fetch("http://localhost:8080/init")
      .then(() => fetchOrders())
      .catch((e) => displayError(e));
  }

  function renderOrders() {
    appLoadingEle.classList.add("d-none");
    orderWrapperEle.classList.remove("d-none");
    addOrderEle.classList.remove("d-none");

    if (orders.length === 0) {
      orderEmptyTextEle.classList.remove("d-none");
      orderTableEle.classList.add("d-none");
      return;
    }

    orderEmptyTextEle.classList.add("d-none");
    orderTableEle.classList.remove("d-none");

    while (orderTableBodyEle.firstChild) {
      orderTableBodyEle.removeChild(orderTableBodyEle.firstChild);
    }

    orders.forEach((order) => {
      const orderId = order.order_id;

      const row = document.createElement("tr");

      row.appendChild(createCell(order.order_id));
      row.appendChild(createCell(order.product_id));
      row.appendChild(createCell(order.quantity));
      row.appendChild(createCell(order.amount));
      row.appendChild(createCell(order.shipping));
      row.appendChild(createCell(order.tax));
      row.appendChild(createCell(order.shipping_address));

      const actionCell = document.createElement("td");

      const deleteButton = document.createElement("button");
      deleteButton.classList.add(...["btn","btn-sm","btn-danger"]);
      deleteButton.innerText = "Delete";

      deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        deleteOrder(orderId);
      });

      actionCell.appendChild(deleteButton);

      row.appendChild(actionCell);

      orderTableBodyEle.appendChild(row);
    });
  }

  function createCell(contents) {
    const cell = document.createElement("td");
    cell.innerText = contents;
    return cell;
  }

  function deleteOrder(orderId) {
    fetch(`http://localhost:8080/delete_order?id=${orderId}`)
      .then(() => fetchOrders());
  }

  function displayError(err) {
    alert("Error:" + err);
  }

  function onAddFormSubmit(e) {
    e.preventDefault();

    const data = {
      order_id : parseFloat(orderIdField.value),
      product_id : parseFloat(productIdField.value),
      quantity : parseFloat(quantityField.value),
      amount : parseFloat(amountField.value),
      shipping : parseFloat(shippingField.value),
      tax : parseFloat(taxField.value),
      shipping_address : shippingAddressField.value,
    };

    fetch("http://localhost:8080/create_order", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    }).then(() => fetchOrders())
      .then(() => resetAddOrderForm());

    alert("Order added");
  }

  function resetAddOrderForm() {
    orderIdField.value = "";
    productIdField.value = "";
    quantityField.value = "";
    amountField.value = "";
    shippingField.value = "";
    taxField.value = "";
    shippingAddressField.value = "";
  }

  fetchOrders();
  addOrderForm.addEventListener("submit", onAddFormSubmit);
})();