import express from 'express';
import {
  createGrupEveniment,
  getAllGrupEvenimente,
  getGrupEvenimentById,
  updateGrupEveniment,
  deleteGrupEveniment
} from '../dataAccess/dataAccessGrup_Evenimente.js';

const grup_evenimenteRouter = express.Router();

// GET: Obține toate grupurile de evenimente
grup_evenimenteRouter.get('/', async (req, res) => {
  try {
    const grupuri = await getAllGrupEvenimente();
    res.json(grupuri);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea grupurilor', error: err.message });
  }
});

// GET: Obține un grup de evenimente după ID
grup_evenimenteRouter.get('/:id', async (req, res) => {
  try {
    const grup = await getGrupEvenimentById(req.params.id);
    res.json(grup);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea grupului', error: err.message });
  }
});

// POST: Creează un grup de evenimente nou
grup_evenimenteRouter.post('/', async (req, res) => {
  try {
    const { titlu_grup } = req.body;
    if (!titlu_grup) {
      return res.status(400).json({ message: 'Titlul grupului este necesar!' });
    }
    const newGrup = await createGrupEveniment({ titlu_grup });
    res.status(201).json(newGrup);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la crearea grupului de evenimente', error: err.message });
  }
});

// PUT: Actualizează un grup de evenimente existent
grup_evenimenteRouter.put('/:id', async (req, res) => {
  try {
    const { titlu_grup } = req.body;
    const updatedGrup = await updateGrupEveniment(req.params.id, { titlu_grup });
    res.json(updatedGrup);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la actualizarea grupului de evenimente', error: err.message });
  }
});

// DELETE: Șterge un grup de evenimente
grup_evenimenteRouter.delete('/:id', async (req, res) => {
  try {
    const result = await deleteGrupEveniment(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la ștergerea grupului de evenimente', error: err.message });
  }
});

export default grup_evenimenteRouter;
