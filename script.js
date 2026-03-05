// Setando os componentes DOM que serão manipulados
const form = document.getElementById("transaction-form");
const list = document.getElementById("transaction-list");
const incomeDisplay = document.getElementById("incomes");
const expenseDisplay = document.getElementById("expense");
const balanceDisplay = document.getElementById("balance");

// Transformando os itens de transactions em objetos ou retornando uma lista vazia se não tiver nenhum
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Pega valores do inputs
  // Retrieves the values ​​from the inputs.
  const description = document.getElementById("description").value.trim();
  let amount = document.getElementById("amount").value;
  amount = amount.replace(/\s+/g, "");

  const regex = /^-?\d+$/;

  if (description === "" || !regex.test(amount)) {
    alert("Preencha os campos corretamente");
    return;
  }

  amount = Number(amount);

  // Cria objeto com valores dos inputs
  // Creates an object using the values from the inputs
  const transaction = {
    id: Date.now(),
    description,
    amount,
  };

  // Adiciona o objeto a lista de objetos "transactions"
  // Add the object to the "transactions" object list
  transactions.push(transaction);
  updateLocalStorage();
  init();
  form.reset();
});

// Função atualiza valores de entrada, saída e total no display
// This function updates the input, output, and total values ​​on the display
function updateValues() {
  // Percorre a array e pega todos os valores das transações
  const amounts = transactions.map((t) => t.amount);
  // Percorre o array "amounts" pegando todos os valores positivos com filter() e vai somando com o reduce()
  const income = amounts.filter((v) => v > 0).reduce((acc, v) => acc + v, 0);
  // Percorre o array "amounts" pegando todos os valores negativos com filter() e vai somando com o reduce()
  const expense = amounts.filter((v) => v < 0).reduce((acc, v) => acc + v, 0);
  const total = income + expense;

  // Atualiza a informação visual com os valores
  incomeDisplay.textContent = `R$ ${income.toFixed(2)}`;
  expenseDisplay.textContent = `R$ ${Math.abs(expense).toFixed(2)}`;
  balanceDisplay.textContent = `R$ ${total.toFixed(2)}`;
}

function addTransactionDOM(transaction) {
  const li = document.createElement("li");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");
  li.innerHTML = `
    ${transaction.description}
    <span>${transaction.amount > 0 ? "+" : "-"}
    R$ ${Math.abs(transaction.amount)}</span>
    <button class="delete-btn">x</button>`;

  li.querySelector(".delete-btn").addEventListener("click", () => {
    transactions = transactions.filter((t) => t.id !== transaction.id);
    updateLocalStorage();
    init();
  });

  list.appendChild(li);
}

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
