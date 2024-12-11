require('dotenv').config(); // Carica le variabili d'ambiente
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

// Inizializza l'app Express
const app = express();

// Configura i middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Inizializza il client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Assicurati che la variabile sia configurata correttamente
});

// Endpoint API
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    // Effettua la richiesta a OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Usa il modello corretto
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message },
      ],
    });

    // Rispondi al client con il risultato
    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Errore dettagliato:', error);
    res.status(500).json({ error: 'Errore durante la comunicazione con OpenAI.' });
  }
});

// Avvia il server
const port = process.env.PORT || 5000; // Usa la porta fornita da Render o 5000
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
