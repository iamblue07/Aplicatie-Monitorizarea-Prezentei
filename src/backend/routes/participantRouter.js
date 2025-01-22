import express from 'express';
import {
  createParticipant,
  getAllParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
  loginParticipant
} from '../dataAccess/dataAccessParticipant.js';

const participantRouter = express.Router();


// POST: Autentificare participant
participantRouter.post('/login', async (req, res) => {
  const { email, parola } = req.body;

  try {
    const data = await loginParticipant(email, parola);

    // Dacă autentificarea a fost reușită, returnează detaliile participantului
    return res.json({ 
      message: 'Autentificare reușită!',
      esteOrganizer: data.esteOrganizer,
      nume: data.nume,
      prenume: data.prenume,
      id_participant: data.id_participant
    });
  } catch (err) {
    res.status(500).json({ message: 'Eroare la autentificare', error: err.message });
  }
});

// GET: Obține toți participanții
participantRouter.get('/', async (req, res) => {
  try {
    const participanti = await getAllParticipants();
    res.json(participanti);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea participanților', error: err.message });
  }
});

// GET: Obține un participant după ID
participantRouter.get('/:id', async (req, res) => {
  try {
    const part = await getParticipantById(req.params.id);
    res.json(part);
  } catch (err) {
    if (err.message === 'Participantul nu a fost găsit') {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Eroare la obținerea participantului', error: err.message });
    }
  }
});

// POST: Creează un participant nou
participantRouter.post('/', async (req, res) => {
  try {
    const { nume, prenume, email, parola, esteOrganizer } = req.body;
    const newParticipant = await createParticipant({ nume, prenume, email, parola, esteOrganizer });
    res.status(201).json(newParticipant);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la crearea participantului', error: err.message });
  }
});

// PUT: Actualizează un participant existent
participantRouter.put('/:id', async (req, res) => {
  try {
    const { nume, prenume, email, esteOrganizer } = req.body;
    const participantUpdated = await updateParticipant(req.params.id, { nume, prenume, email, esteOrganizer });
    res.json({ message: 'Participantul a fost actualizat cu succes!', data: participantUpdated });
  } catch (err) {
    if (err.message === 'Participantul nu a fost găsit') {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Eroare la actualizarea participantului', error: err.message });
    }
  }
});

// DELETE: Șterge un participant
participantRouter.delete('/:id', async (req, res) => {
  try {
    const result = await deleteParticipant(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Participantul nu a fost găsit') {
      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Eroare la ștergerea participantului', error: err.message });
    }
  }
});

export default participantRouter;