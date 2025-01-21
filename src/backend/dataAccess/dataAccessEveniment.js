import eveniment from '../entities/eveniment.js';
import participantiLaEveniment from '../entities/participantiLaEveniment.js';

// Create: Creează un nou eveniment
export const createEveniment = async (evenimentData) => {
  try {
    const ev = await eveniment.create(evenimentData);
    return ev;
  } catch (error) {
    throw new Error('Eroare la crearea evenimentului: ' + error.message);
  }
};

// Read: Obține toate evenimentele
export const getAllEvenimente = async () => {
  try {
    const evs = await eveniment.findAll();
    return evs;
  } catch (error) {
    throw new Error('Eroare la obținerea evenimentelor: ' + error.message);
  }
};

// Read: Obține un eveniment după ID
export const getEvenimentById = async (id) => {
  try {
    const ev = await eveniment.findByPk(id);
    if (!ev) {
      throw new Error('Evenimentul nu a fost găsit');
    }
    return ev;
  } catch (error) {
    throw new Error('Eroare la obținerea evenimentului: ' + error.message);
  }
};

// Update: Actualizează un eveniment
export const updateEveniment = async (id, evenimentData) => {
  try {
    const ev = await eveniment.findByPk(id);
    if (!ev) {
      throw new Error('Evenimentul nu a fost găsit');
    }
    await ev.update(evenimentData);
    return ev;
  } catch (error) {
    throw new Error('Eroare la actualizarea evenimentului: ' + error.message);
  }
};

// Delete: Șterge un eveniment și participanții asociați
export const deleteEveniment = async (id) => {
  try {
      // Căutăm mai întâi evenimentul
      const ev = await eveniment.findByPk(id);
      if (!ev) {
          throw new Error('Evenimentul nu a fost găsit');
      }

      // Ștergem înregistrările din tabela de legătură participantiLaEveniment
      await participantiLaEveniment.destroy({
          where: {
              id_eveniment: id
          }
      });

      // Ștergem evenimentul
      await ev.destroy();

      return { message: 'Evenimentul și participanții asociați au fost șterși cu succes' };
  } catch (error) {
      throw new Error('Eroare la ștergerea evenimentului: ' + error.message);
  }
};
