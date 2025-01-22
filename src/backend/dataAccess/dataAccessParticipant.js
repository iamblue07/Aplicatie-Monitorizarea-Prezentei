import participant from '../entities/participant.js';

// Login: Verifică autentificarea participantului
export const loginParticipant = async (email, parola) => {
  try {
    const part = await participant.findOne({ where: { email } });
    console.log(part);
    
    if (!part) {
      throw new Error('Participantul nu a fost găsit');
    }

    // Verifică dacă parola introdusă corespunde cu cea din baza de date
    if (part.parola !== parola) {
      throw new Error('Parola incorectă');
    }

    // Returnează informațiile despre participant
    return {
      esteOrganizer: part.esteOrganizer,
      nume: part.nume,
      prenume: part.prenume,
      id_participant:part.id_participant
    };
  } catch (error) {
    throw new Error('Eroare la autentificare: ' + error.message);
  }
};

// Create: Creează un nou participant
export const createParticipant = async (participantData) => {
  try {
    const part = await participant.create(participantData);
    return part;
  } catch (error) {
    throw new Error('Eroare la crearea participantului: ' + error.message);
  }
};

// Read: Obține toți participanții
export const getAllParticipants = async () => {
  try {
    const parts = await participant.findAll();
    return parts;
  } catch (error) {
    throw new Error('Eroare la obținerea participanților: ' + error.message);
  }
};

// Read: Obține un participant după ID
export const getParticipantById = async (id) => {
  try {
    const part = await participant.findByPk(id);
    if (!part) {
      throw new Error('Participantul nu a fost găsit');
    }
    return part;
  } catch (error) {
    throw new Error('Eroare la obținerea participantului: ' + error.message);
  }
};

// Update: Actualizează un participant
export const updateParticipant = async (id, participantData) => {
  try {
    const part = await participant.findByPk(id);
    if (!part) {
      throw new Error('Participantul nu a fost găsit');
    }
    await part.update(participantData);
    return participant;
  } catch (error) {
    throw new Error('Eroare la actualizarea participantului: ' + error.message);
  }
};

// Delete: Șterge un participant
export const deleteParticipant = async (id) => {
  try {
    const part = await participant.findByPk(id);
    if (!part) {
      throw new Error('Participantul nu a fost găsit');
    }
    await part.destroy();
    return { message: 'Participantul a fost șters cu succes' };
  } catch (error) {
    throw new Error('Eroare la ștergerea participantului: ' + error.message);
  }
};
