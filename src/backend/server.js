import express from 'express';
import cors from 'cors';

import evenimentRouter from './routes/evenimentRouter.js';
import grup_evenimenteRouter from './routes/grup_evenimenteRouter.js';
import participantiLaEvenimentRouter from './routes/participantiLaEvenimentRouter.js';
import participantRouter from './routes/participantRouter.js';

import sequelize from '../backend/database/db.js';

// Inițializăm aplicația Express
let app = express();

// Middleware pentru procesarea JSON și URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pentru CORS (permite accesul cross-origin)
app.use(cors());

// Setăm rutele pentru fiecare resursă
app.use('/api/evenimente', evenimentRouter);
app.use('/api/grupuri-evenimente', grup_evenimenteRouter);
app.use('/api/participanti-eveniment', participantiLaEvenimentRouter);
app.use('/api/participanti', participantRouter);

sequelize.sync({ force: false }) // Setează `force: true` doar dacă vrei să ștergi și să recreezi tabelele
  .then(() => {
    console.log("Toate tabelele au fost sincronizate cu baza de date.");
  })
  .catch((error) => {
    console.error("Eroare la sincronizarea tabelelor:", error);
  });

// Conectarea la baza de date și pornirea serverului
sequelize.authenticate()
  .then(() => {
    console.log("Conexiune cu baza de date reușită!");
    // Pornim serverul pe portul dorit
    const PORT = process.env.PORT || 3000; // Folosește variabila de mediu PORT sau 3000 ca port default
    app.listen(PORT, () => {
      console.log(`Serverul rulează pe portul ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Eroare la conexiunea bazei de date:', err);
  });
