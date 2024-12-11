app.use(cors({ origin: '*' }));
require('dotenv').config({ path: './api.env' });

const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurazione OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint per l'API di chat
app.post('/api/chat', async (req, res) => {
  console.log('Richiesta ricevuta:', req.body); // Log della richiesta ricevuta

  try {
    const { message } = req.body;

    // Controllo se il messaggio è presente
    if (!message) {
      return res.status(400).json({ error: 'Il campo "message" è obbligatorio.' });
    }

    // Chiamata all'API di OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Modello da usare
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
    });

    // Controllo sulla risposta dell'API
    if (!completion || !completion.choices || !completion.choices.length) {
      throw new Error('Risposta malformata dall\'API OpenAI.');
    }

    // Risposta con il contenuto della risposta
    console.log('Risposta OpenAI:', completion.choices[0].message.content);
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Errore dettagliato:', error.response?.data || error.message);

    res.status(500).json({
      error: error.response?.data?.error?.message || 'Errore durante la comunicazione con OpenAI.',
    });
}
});

// Avvio del server
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
