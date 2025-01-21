import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import "../styles/EventComponent.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../hooks/useAuth';

const EventComponent = () => {
  const { id_group, id_event } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const {isAuthenticated, isOrganizer} = useContext(AuthContext);
  const navigate = useNavigate();
  


  const handleTitleChange = (e) => {
    //fiecare handle event de aici modifica in timp direct obiectul de tip event de pe client. Pentru a face modificarile pe server trebuie scris saveChanges
    setEvent(prevEvent => ({ ...prevEvent, event_name: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setEvent(prevEvent => ({ ...prevEvent, description: e.target.value }));
  };

  const handleStartDateChange = (e) => {
    setEvent(prevEvent => ({ ...prevEvent, start_date: e.target.value }));
  };

  const handleStopDateChange = (e) => {
    setEvent(prevEvent => ({ ...prevEvent, stop_date: e.target.value }));
  };

  const saveChanges = (type) => {
    // TODO: Save the changes to the backend
    //type va primi un string care ii spune ce se va modifica. Recomand cu if-uri sa verifici tipul si sa modifici pe server doar acea coloana
    console.log(`${type} updated for event ${id_event}`);
  };

  const readParticipants = (id_event) => {
    //TODO citit id, numele participantilor si ora conectarii la eveniment
    
    const mockParticipants = [
      { id_participant: "1",
        nume_participant: "Calin Georgescu",
        data_conectarii: "12/04/2023"
      },
      { id_participant: "2",
        nume_participant: "George Calinescu",
        data_conectarii: "04/12/2023"
      }
    ]
    setParticipants(mockParticipants);
  }

  const downloadParticipants = (id_event) => {
    //TODO citit id, numele participantilor si ora conectarii la eveniment si descarcarea listei
    
  }



  useEffect(() => {
    // TODO de cautat in BD evenimentul si actualizat event
    console.log("id_group:", id_group, "id_eveniment:", id_event);
    if(!isAuthenticated || !isOrganizer) {
      navigate("/");
    } else {
      const MockEventDetails = {
        id_eveniment: id_event,
        id_grup: id_group,
        titlu_eveniment: "Eveniment " + id_event,
        descriere_eveniment: "Descriere pentru eveniment " + id_event,
        data_start: "2024-12-25T10:00:00",
        data_stop: "2024-12-25T12:00:00",
        cod_acces: "1234",
      };
      console.log(MockEventDetails);
    setEvent(MockEventDetails);
  }
  }, [id_group, id_event, isAuthenticated, isOrganizer, participants]);

  if (!event) return <div>Loading...</div>;

return (
  event ? (
    <div className="event-details">
      <h2 style={{ textAlign: "center" }}>{event.event_name}</h2>

      <div>
        <label>Titlu Eveniment:</label>
        <input
          type="text"
          value={event.titlu_eveniment}
          onChange={handleTitleChange}
        />
        <button onClick={() => saveChanges("Titlu Eveniment")}>Save</button>
      </div>

      <div>
        <label>Descriere Eveniment:</label>
        <input
          type="text"
          value={event.descriere_eveniment}
          onChange={handleDescriptionChange}
        />
        <button onClick={() => saveChanges("Descriere Eveniment")}>Save</button>
      </div>

      <div>
        <label>Data Start:</label>
        <input
          type="datetime-local"
          value={event.data_start}
          onChange={handleStartDateChange}
        />
        <button onClick={() => saveChanges("Data Start")}>Save</button>
      </div>

      <div>
        <label>Data Stop:</label>
        <input
          type="datetime-local"
          value={event.data_stop}
          onChange={handleStopDateChange}
        />
        <button onClick={() => saveChanges("Data Stop")}>Save</button>
      </div>

      <div>
        <img src="https://via.placeholder.com/150" alt="QR Code" />
        <p className='access-code'>Cod de acces: {event.cod_acces}</p>
      </div>

      <div>
        <button className="btn-usersList" onClick={ () => readParticipants(id_event)}> Vezi lista participantilor </button>
        <div className="div-usersList">
          {participants.length > 0 ? (
            <ul>
              {participants.map((participant) => (
                <li key={participant.id_participant}>
                  <strong>{participant.nume_participant}</strong> S-a conectat la: {participant.data_conectarii}
                </li>
              ))}
            </ul>
          ) : (
            <p></p>
          )}
        </div>
        <button className="btn-CSV" onClick={ () => downloadParticipants(id_event)}>Descarca lista participantilor</button>
      </div>
    </div>
  ) : (
    <p>Se încarcă detaliile evenimentului...</p>
  )
);
}
export default EventComponent;
