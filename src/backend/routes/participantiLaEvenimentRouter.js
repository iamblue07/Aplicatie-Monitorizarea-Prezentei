import express from 'express';
import {
  addParticipantLaEveniment,
  getParticipantiLaEveniment,
  deleteParticipantLaEveniment,
} from '../dataAccess/dataAccessParticipantiLaEveniment.js';

const participantiLaEvenimentRouter = express.Router();

// GET: Obține toți participanții la un eveniment
participantiLaEvenimentRouter.get('/:id_eveniment', async (req, res) => {
  try {
    const participanti = await getParticipantiLaEveniment(req.params.id_eveniment);
    res.json(participanti);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea participanților', error: err.message });
  }
});

// POST: Adaugă un participant la un eveniment
participantiLaEvenimentRouter.post('/', async (req, res) => {
  try {
    const { id_eveniment, id_participant, data_confirmare } = req.body;
    const newParticipare = await addParticipantLaEveniment({ id_eveniment, id_participant, data_confirmare });
    res.status(201).json(newParticipare);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la adăugarea participantului la eveniment', error: err.message });
  }
});

// DELETE: Șterge un participant dintr-un eveniment
participantiLaEvenimentRouter.delete('/:id_eveniment/:id_participant', async (req, res) => {
  try {
    const { id_eveniment, id_participant } = req.params;
    const result = await deleteParticipantLaEveniment(id_eveniment, id_participant);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la ștergerea participantului din eveniment', error: err.message });
  }
});

export default participantiLaEvenimentRouter;
