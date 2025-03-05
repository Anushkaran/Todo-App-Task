
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInputs = document.getElementsByName('type');
const addEntryButton = document.getElementById('addEntry');
const resetEntryButton = document.getElementById('resetEntry');
const entryList = document.getElementById('entryList');
const totalIncomeDisplay = document.getElementById('totalIncome');
const totalExpensesDisplay = document.getElementById('totalExpenses');
const netBalanceDisplay = document.getElementById('netBalance');
const filterInputs = document.getElementsByName('filter');

let entries = JSON.parse(localStorage.getItem('entries')) || [];
let editIndex = -1;

function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;

    entries.forEach(entry => {
        if (entry.type === 'income') {
            totalIncome += entry.amount;
        } else {
            totalExpenses += entry.amount;
        }
    });

    totalIncomeDisplay.textContent = totalIncome;
    totalExpensesDisplay.textContent = totalExpenses;
    netBalanceDisplay.textContent = totalIncome - totalExpenses;
}

function renderEntries() {
    entryList.innerHTML = '';
    const selectedFilter = document.querySelector('input[name="filter"]:checked').value;
    const filteredEntries = selectedFilter === 'all' ? entries : entries.filter(entry => entry.type === selectedFilter);

    filteredEntries.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td class="border p-2">${entry.description}</td>
                    <td class="border p-2">${entry.amount}</td>
                    <td class="border p-2">${entry.type}</td>
                    <td class="border p-2">
                        <button class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2 edit-button" data-index="${index}">Edit</button>
                        <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded delete-button" data-index="${index}">Delete</button>
                    </td>
                `;
        entryList.appendChild(row);
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', editEntry);
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', deleteEntry);
    });

    updateSummary();
}

function addEntry() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = document.querySelector('input[name="type"]:checked').value;

    if (!description || isNaN(amount)) return;

    if (editIndex === -1) {
        entries.push({ description, amount, type });
    } else {
        entries[editIndex] = { description, amount, type };
        editIndex = -1;
    }

    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
    resetInputs();
}

function editEntry(event) {
    const index = parseInt(event.target.dataset.index);
    editIndex = index;
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    document.querySelector(`input[value="${entry.type}"]`).checked = true;
}

function deleteEntry(event) {
    const index = parseInt(event.target.dataset.index);
    entries.splice(index, 1);
    localStorage.setItem('entries', JSON.stringify(entries));
    renderEntries();
}

function resetInputs() {
    descriptionInput.value = '';
    amountInput.value = '';
    document.querySelector('input[value="income"]').checked = true;
}

addEntryButton.addEventListener('click', addEntry);
resetEntryButton.addEventListener('click', resetInputs);
filterInputs.forEach(input => {
    input.addEventListener('change', renderEntries);
})

renderEntries();
