// Importa le librerie necessarie
const axios = require('axios'); // Per effettuare richieste HTTP
const fs = require('fs'); // Per interagire con il file system

// Nome del file CSV dove memorizzare i prezzi
const CSV_FILE = 'crypto_prices.csv';

async function getPrices() {
 try {
   // Lista dei simboli delle criptovalute da recuperare
   const symbols = ['BTCUSDT', 'ETHUSDT'];

   // Endpoint dell'API Binance per ottenere i prezzi
   const endpoint = 'https://api.binance.com/api/v3/ticker/price';

   // Invia richieste simultanee per ottenere i prezzi delle criptovalute
   const responses = await Promise.all(
     symbols.map((symbol) => axios.get(endpoint, { params: { symbol } }))
   );

   // Salva i prezzi in un oggetto
   const prices = {};
   responses.forEach((response) => {
     const price = parseFloat(response.data.price);
     const symbol = response.config.params.symbol;
     prices[symbol] = price;
   });

   // Aggiungi i nuovi prezzi al file CSV esistente (se esiste)
   let csvData;
   try {
     csvData = fs.readFileSync(CSV_FILE, 'utf8'); // Leggi i dati esistenti
   } catch (err) {
     // Se il file non esiste, crea una riga di intestazione vuota
     csvData = '';
   }

   // Converti i nuovi prezzi in formato CSV
   const newCsvData = Object.entries(prices)
     .map(([symbol, price]) => `<span class="math-inline">\{symbol\},</span>{price}`)
     .join('\n');

   // Aggiungi i nuovi dati al file CSV esistente
   csvData += newCsvData ? `\n${newCsvData}` : newCsvData;

   // Scrivi i dati aggiornati nel file CSV
   fs.writeFileSync(CSV_FILE, csvData);

   console.log('Dati salvati in crypto_prices.csv');
 } catch (error) {
   console.error('Errore durante il recupero dei prezzi:', error.message);
 }
}

// Esegui la funzione `getPrices` ogni 5 secondi
setInterval(getPrices, 2*1000);
