const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = { transactions: [] };

document.getElementById("button-logout").addEventListener("click", logout);
document.getElementById("edit").addEventListener("click", (e) => {
  const id = e.target.id.split(" ")[0]; // Extrai o ID do botão clicado
  editTransaction(id);
});

//ADICIONAR/EDITAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const value = parseFloat(document.getElementById("value-input").value);
  const description = document.getElementById("description-input").value;
  const date = document.getElementById("date-input").value;
  const type = document.querySelector("input[name='type-input']:checked").value;

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

//EXCLUIR LANÇAMENTO
document.getElementById("delete").addEventListener("click", (e) => {
  const id = e.target.id.split(" ")[0];
  deleteTransaction(id);
});

checkLogged();

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
  }

  getTransactions();
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
      let type = "Entrada";

      if (item.type === "2") {
        type = "Saída";
      }

      id++;

      transactionsHtml += `
        <tr>
            <th scope="row">${item.date}</th>
            <td>${item.value.toFixed(2)}</td>
            <td>${type}</td>
            <td>${item.description}</td>
            <td><i class="bi bi-pencil-square button-actions" id="${id} edit"></i>
            <i class="bi bi-x-square button-actions" id="${id} delete"></i></td>
        </tr>
      `;
    });
  }
  document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function saveData(data) {
  localStorage.setItem(data.login, JSON.stringify(data));
}

//EDITAR LANÇAMENTO
function editTransaction(id) {
  const transaction = data.transactions.find((item, index) => index === id - 1);
  if (transaction) {
    // Preencher o formulário com os dados da transação
    document.getElementById("value-input").value = transaction.value;
    document.getElementById("description-input").value =
      transaction.description;
    document.getElementById("date-input").value = transaction.date;
    document.querySelector(
      `input[name='type-input'][value='${transaction.type}']`
    ).checked = true;

    editingId = id - 1; // Armazena o índice da transação sendo editada
    myModal.show();
  }
}
