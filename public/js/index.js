const myModal = new bootstrap.Modal("#register-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

checkLogged();

//LOGAR NO SISTEMA
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email-input").value;
  const password = document.getElementById("password-input").value;
  const checkSession = document.getElementById("session-check").checked;

  const account = getAccount(email);

  if (!account) {
    alert("Verifique o usuário ou a senha!");
    return;
  } else {
    if (account.password !== password) {
      alert("Verifique o usuário ou a senha!");
      return;
    }

    saveSession(email, checkSession);
    window.location.href = "home.html";
  }
});

//CRIAR CONTA
document.getElementById("create-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email-create-input").value;
  const password = document.getElementById("password-create-input").value;
  const passwordConfirm = document.getElementById(
    "password-confirm-input"
  ).value;

  if (localStorage.getItem(email)) {
    alert("Email já cadastrado no sistema.");
    return;
  }

  if (email.length < 6) {
    alert("Insira um e-mail válido.");
    return;
  }

  if (password.length < 4) {
    alert("A senha deve ter pelo menos 4 dígitos.");
  }

  if (password !== passwordConfirm) {
    alert("As senhas não conferem!");
  }

  saveAccount({
    login: email,
    password: password,
    transactions: [],
  });

  myModal.hide();
  alert("Conta criada com sucesso!");
});

function checkLogged() {
  if (session) {
    sessionStorage.setItem("logged", session);
    logged = session;
  }

  if (logged) {
    saveSession(logged, session);

    window.location.href = "home.html";
  }
}

function saveAccount(data) {
  localStorage.setItem(data.login, JSON.stringify(data));
}

function saveSession(data, saveSession) {
  if (saveSession) {
    localStorage.setItem("session", data);
  }
  sessionStorage.setItem("logged", data);
}

function getAccount(key) {
  const account = localStorage.getItem(key);

  if (account) {
    return JSON.parse(account);
  }
  return "";
}
