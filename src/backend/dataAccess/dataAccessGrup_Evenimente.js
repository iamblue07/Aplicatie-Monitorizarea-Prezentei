import grup_evenimente from '../entities/grup_evenimente.js';
import eveniment from '../entities/eveniment.js';

// Create: Creează un nou grup de evenimente
export const createGrupEveniment = async (grupEvenimentData) => {
  try {
    const grupEveniment = await grup_evenimente.create(grupEvenimentData);
    return grupEveniment;
  } catch (error) {
    throw new Error('Eroare la crearea grupului de evenimente: ' + error.message);
  }
};

// Read: Obține toate grupurile de evenimente
export const getAllGrupEvenimente = async () => {
  try {
    const grupuriEvenimente = await grup_evenimente.findAll();
    return grupuriEvenimente;
  } catch (error) {
    throw new Error('Eroare la obținerea grupurilor de evenimente: ' + error.message);
  }
};

// Read: Obține un grup de evenimente după ID
export const getGrupEvenimentById = async (id) => {
  try {
    const grupEveniment = await grup_evenimente.findByPk(id);
    if (!grupEveniment) {
      throw new Error('Grupul de evenimente nu a fost găsit');
    }
    return grupEveniment;
  } catch (error) {
    throw new Error('Eroare la obținerea grupului de evenimente: ' + error.message);
  }
};

// Update: Actualizează un grup de evenimente
export const updateGrupEveniment = async (id, grupEvenimentData) => {
  try {
    const grupEveniment = await grup_evenimente.findByPk(id);
    if (!grupEveniment) {
      throw new Error('Grupul de evenimente nu a fost găsit');
    }
    await grupEveniment.update(grupEvenimentData);
    return grupEveniment;
  } catch (error) {
    throw new Error('Eroare la actualizarea grupului de evenimente: ' + error.message);
  }
};

// Delete: Șterge un grup de evenimente
export const deleteGrupEveniment = async (id) => {
  try {
    // Găsim grupul de evenimente
    const grupEveniment = await grup_evenimente.findByPk(id, {
      include: {
        model: eveniment,
        as: 'evenimente_asociate', // Numele aliasului trebuie să corespundă configurării relației
      },
    });

    if (!grupEveniment) {
      throw new Error('Grupul de evenimente nu a fost găsit');
    }

    // Ștergem toate evenimentele asociate grupului
    if (grupEveniment.evenimente_asociate && grupEveniment.evenimente_asociate.length > 0) {
      for (const event of grupEveniment.evenimente_asociate) {
        await event.destroy();
      }
    }

    // Ștergem grupul de evenimente
    await grupEveniment.destroy();

    return { message: 'Grupul de evenimente și toate evenimentele asociate au fost șterse cu succes' };
  } catch (error) {
    throw new Error('Eroare la ștergerea grupului de evenimente: ' + error.message);
  }
};
