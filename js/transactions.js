const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = { transactions: [] };
let editingId = null;

checkLogged();

document.getElementById("button-logout").addEventListener("click", logout);
document
  .querySelector(".button-float")
  .addEventListener("click", addTransaction);

//ADICIONAR/EDITAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const value = parseFloat(document.getElementById("value-input").value);
  const description = document.getElementById("description-input").value;
  const date = document.getElementById("date-input").value;
  const type = document.querySelector("input[name='type-input']:checked").value;
  let currentTotal = checkTotal();

  // Verificar se a operação não vai deixar o total negativo
  if (type === "2" && currentTotal - value < 0) {
    if (
      !confirm("A operação resultará em um saldo negativo. Deseja prosseguir?")
    ) {
      return; // Cancela a operação se o usuário não confirmar
    }
  }

  if (editingId !== null) {
    // Atualiza a transação existente
    data.transactions[editingId] = {
      value,
      type,
      description,
      date,
    };
    editingId = null; // Reseta a variável após a edição
    alert("Lançamento editado com sucesso.");
  } else {
    // Adiciona uma nova transação
    data.transactions.unshift({
      value,
      type,
      description,
      date,
    });
    alert("Lançamento adicionado com sucesso.");
  }

  saveData(data);
  e.target.reset();
  myModal.hide();
  getTransactions();
});

//ADICIONAR LANÇAMENTO
function addTransaction() {
  editingId = null; // Reseta o ID de edição
  document.getElementById("transaction-form").reset(); // Limpa o formulário
  document.getElementById("modal-title").innerText = "Adicionar Lançamento"; // Reseta o título
  document.getElementById("button-save").innerText = "Adicionar";
  myModal.show();
}

//EDITAR LANÇAMENTO
function editTransaction(id) {
  const transaction = data.transactions.find((item, index) => index === id - 1);

  if (transaction) {
    document.getElementById("value-input").value = transaction.value;
    document.getElementById("description-input").value =
      transaction.description;
    document.getElementById("date-input").value = transaction.date;
    document.querySelector(
      `input[name='type-input'][value='${transaction.type}']`
    ).checked = true;

    editingId = id - 1; // Armazena o índice da transação sendo editada
    document.getElementById("modal-title").innerText = "Editar Lançamento";
    document.getElementById("button-save").innerText = "Salvar";
    myModal.show();
  }
}

//EXCLUIR LANÇAMENTO
function deleteTransaction(id) {
  const index = data.transactions.findIndex((item, index) => index === id - 1);

  if (index === -1) {
    alert("Lançamento não encontrado.");
    return;
  }
  if (
    index !== -1 &&
    confirm("Esta ação não pode ser desfeita. Deseja excluir este lançamento?")
  ) {
    data.transactions.splice(index, 1);

    saveData(data);
    getTransactions();

    alert("Lançamento excluído com sucesso.");
  }
}

function checkLogged() {
  if (session) {
    sessionStorage.setItem("logged", session);
    logged = session;
  }

  if (!logged) {
    window.location.href = "index.html";
  }

  const dataUser = localStorage.getItem(logged);
  if (dataUser) {
    data = JSON.parse(dataUser);
    getTransactions();
  }
}

function logout() {
  sessionStorage.removeItem("logged");
  localStorage.removeItem("session");

  window.location.href = "index.html";
}

function getTransactions() {
  const transactions = data.transactions;
  let transactionsHtml = ``;
  let id = 0;

  if (transactions.length) {
    transactions.forEach((item) => {
      let type = item.type === "1" ? "Entrada" : "Saída";
      id++;

      // Formatar data para dd/MM/yyyy
      const dateFormatted = item.date.split("-").reverse().join("/");

      transactionsHtml += `
        <tr>
            <td>${dateFormatted}</td>
            <td>${item.value.toFixed(2)}</td>
            <td>${type}</td>
            <td>${item.description}</td>
            <td><i class="bi bi-pencil-square button-actions" onclick="editTransaction(${id})"></i>
            <i class="bi bi-x-square button-actions" onclick="deleteTransaction(${id})"></i></td>
        </tr>
      `;
    });
  }
  document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function saveData(data) {
  localStorage.setItem(data.login, JSON.stringify(data));
}

function checkTotal() {
  const transactions = data.transactions;
  let total = 0;

  transactions.forEach((item) => {
    if (item.type === "1") {
      total += item.value;
    } else {
      total -= item.value;
    }
  });

  return total;
}
