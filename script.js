// Setando os componentes DOM que serão manipulados
const form = document.getElementById("transaction-form")
const list = document.getElementById("transaction-list")
const incomeDisplay = document.getElementById("incomes")
const expenseDisplay = document.getElementById("expense")
const balanceDisplay = document.getElementById("balance")

// Transformando os itens de transactions em objetos ou retornando uma lista vazia se não tiver nenhum
let transactions = JSON.parse(localStorage.getItem("transactions")) || []

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions))
}

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const description = document.getElementById("description").value.trim()
    const amount = Number(document.getElementById("amount").value)

    if (description === "" || isNaN(amount)) {
        alert("Preencha os campos corretamente")
        return
    }

    const transaction = {
        id: Date.now(),
        description,
        amount
    }

    transactions.push(transaction)
    updateLocalStorage()
    init()
    form.reset()
})

function updateValues() {
    const amounts = transactions.map(t => t.amount)
    const income = amounts.filter(v => v > 0).reduce((acc, v) => acc + v, 0)
    const expense = amounts.filter(v => v < 0).reduce((acc, v) => acc + v, 0)
    const total = income + expense
    
    incomeDisplay.textContent = `R$ ${income.toFixed(2)}`
    expenseDisplay.textContent = `R$ ${Math.abs(expense).toFixed(2)}`
    balanceDisplay.textContent = `R$ ${total.toFixed(2)}`
}

function addTransactionDOM(transaction) {
    const li = document.createElement("li")
    li.classList.add(transaction.amount > 0 ? "income" : "expense")
    li.innerHTML = `
    ${transaction.description}
    <span>${transaction.amount > 0 ? "+" : "-"}
    R$ ${Math.abs(transaction.amount)}</span>
    <button class="delete-btn">x</button>`;
    

    li.querySelector(".delete-btn").addEventListener("click", () => {
        transactions = transactions.filter(t => t.id !== transaction.id)
        updateLocalStorage()
        init()
    })

    list.appendChild(li)
}

function init() {
    list.innerHTML = ""
    transactions.forEach(addTransactionDOM)
    updateValues()
}

init()