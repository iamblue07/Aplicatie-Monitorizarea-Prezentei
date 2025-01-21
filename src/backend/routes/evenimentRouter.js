import express from 'express';
import {
  createEveniment,
  getAllEvenimente,
  getEvenimentById,
  updateEveniment,
  deleteEveniment
} from '../dataAccess/dataAccessEveniment.js';

const evenimentRouter = express.Router();

// GET: Obține toate evenimentele
evenimentRouter.get('/', async (req, res) => {
  try {
    const evenimente = await getAllEvenimente();
    res.json(evenimente);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la obținerea evenimentelor', error: err.message });
  }
});

// GET: Obține un eveniment după ID
evenimentRouter.get('/:id', async (req, res) => {
  try {
    const even = await getEvenimentById(req.params.id);
    res.json(even);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// POST: Creează un eveniment nou
evenimentRouter.post('/', async (req, res) => {
  try {
    const { id_grup, titlu_eveniment, descriere_eveniment, data_start, data_stop, cod_acces } = req.body;
    const newEveniment = await createEveniment({ id_grup, titlu_eveniment, descriere_eveniment, data_start, data_stop, cod_acces });
    res.status(201).json(newEveniment);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la crearea evenimentului', error: err.message });
  }
});

// PUT: Actualizează un eveniment existent
evenimentRouter.put('/:id', async (req, res) => {
  try {
    const { titlu_eveniment, descriere_eveniment, data_start, data_stop, cod_acces } = req.body;
    const updatedEveniment = await updateEveniment(req.params.id, { titlu_eveniment, descriere_eveniment, data_start, data_stop, cod_acces });
    res.json({ message: 'Evenimentul a fost actualizat cu succes!', eveniment: updatedEveniment });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// DELETE: Șterge un eveniment
evenimentRouter.delete('/:id', async (req, res) => {
  try {
    const result = await deleteEveniment(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

export default evenimentRouter;
