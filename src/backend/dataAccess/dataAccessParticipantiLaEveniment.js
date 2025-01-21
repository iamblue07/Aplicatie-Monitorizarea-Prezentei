import participantiLaEveniment from '../entities/participantiLaEveniment.js';

// Create: Adaugă un participant la un eveniment
export const addParticipantLaEveniment = async (data) => {
  try {
    const participare = await participantiLaEveniment.create(data);
    return participare;
  } catch (error) {
    throw new Error('Eroare la adăugarea participantului la eveniment: ' + error.message);
  }
};

// Read: Obține toți participanții la un eveniment
export const getParticipantiLaEveniment = async (idEveniment) => {
  try {
    const participanti = await participantiLaEveniment.findAll({
      where: { id_eveniment: idEveniment },
    });
    return participanti;
  } catch (error) {
    throw new Error('Eroare la obținerea participanților la eveniment: ' + error.message);
  }
};

// Read: Obține un participant la un eveniment după ID
export const getParticipantLaEvenimentById = async (idEveniment, idParticipant) => {
  try {
    const participare = await participantiLaEveniment.findOne({
      where: {
        id_eveniment: idEveniment,
        id_participant: idParticipant,
      },
    });
    if (!participare) {
      throw new Error('Participantul nu a fost găsit la acest eveniment');
    }
    return participare;
  } catch (error) {
    throw new Error('Eroare la obținerea participantului la eveniment: ' + error.message);
  }
};

// Update: Actualizează datele unui participant la eveniment
export const updateParticipantLaEveniment = async (idEveniment, idParticipant, data) => {
  try {
    const participare = await participantiLaEveniment.findOne({
      where: {
        id_eveniment: idEveniment,
        id_participant: idParticipant,
      },
    });
    if (!participare) {
      throw new Error('Participantul nu a fost găsit la acest eveniment');
    }
    await participare.update(data);
    return participare;
  } catch (error) {
    throw new Error('Eroare la actualizarea participantului la eveniment: ' + error.message);
  }
};

// Delete: Șterge un participant dintr-un eveniment
export const deleteParticipantLaEveniment = async (idEveniment, idParticipant) => {
  try {
    const participare = await participantiLaEveniment.findOne({
      where: {
        id_eveniment: idEveniment,
        id_participant: idParticipant,
      },
    });
    if (!participare) {
      throw new Error('Participantul nu a fost găsit la acest eveniment');
    }
    await participare.destroy();
    return { message: 'Participantul a fost șters cu succes de la eveniment' };
  } catch (error) {
    throw new Error('Eroare la ștergerea participantului de la eveniment: ' + error.message);
  }
};
