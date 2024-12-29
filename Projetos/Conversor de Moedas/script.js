const amountInput = document.getElementById('amount');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const convertButton = document.getElementById('convert');
const resultText = document.getElementById('result');
const loadingText = document.getElementById('loading');

const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

// Popula as opções de moedas
async function populateCurrencyOptions() {
    const response = await fetch(`${API_URL}USD`);
    const data = await response.json();
    const currencies = Object.keys(data.rates);

    currencies.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency;
        optionFrom.textContent = currency;
        fromCurrency.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = currency;
        optionTo.textContent = currency;
        toCurrency.appendChild(optionTo);
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'BRL';
}

// Função de conversão
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const from = fromCurrency.value;
    const to = toCurrency.value;

    if (isNaN(amount) || amount <= 0) {
        resultText.textContent = 'Por favor, insira um valor válido.';
        return;
    }

    loadingText.classList.remove('hidden');
    resultText.textContent = '';

    try {
        const response = await fetch(`${API_URL}${from}`);
        const data = await response.json();
        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);

        resultText.textContent = `${amount} ${from} = ${convertedAmount} ${to}`;
    } catch (error) {
        resultText.textContent = 'Erro ao obter dados. Tente novamente mais tarde.';
    } finally {
        loadingText.classList.add('hidden');
    }
}

populateCurrencyOptions();
convertButton.addEventListener('click', convertCurrency);
