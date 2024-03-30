const axios = require('axios');
const fs = require('fs');

const CSV_FILE = 'crypto_prices.csv'; // Name of the CSV file

async function getPrices() {
  try {
    const symbols = ['BTCUSDT', 'ETHUSDT'];
    const endpoint = 'https://api.binance.com/api/v3/ticker/price';

    const responses = await Promise.all(
      symbols.map((symbol) => axios.get(endpoint, { params: { symbol } }))
    );

    const prices = {};
    responses.forEach((response) => {
      const price = parseFloat(response.data.price);
      const symbol = response.config.params.symbol;
      prices[symbol] = price;
    });

    // Append prices to existing CSV data (if the file exists)
    let csvData;
    try {
      csvData = fs.readFileSync(CSV_FILE, 'utf8'); // Read existing data
    } catch (err) {
      // If file doesn't exist, create a header row
      csvData = '';
    }

    const newCsvData = Object.entries(prices)
      .map(([symbol, price]) => `${symbol},${price}`)
      .join('\n');

    // Append new data with a newline character
    csvData += newCsvData ? `\n${newCsvData}` : newCsvData;

    fs.writeFileSync(CSV_FILE, csvData);

    console.log('Dati salvati in crypto_prices.csv');
  } catch (error) {
    console.error('Errore durante il recupero dei prezzi:', error.message);
  }
}

// Esegui la funzione ogni 5 secondi
setInterval(getPrices, 5000);
