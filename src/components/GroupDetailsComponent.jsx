import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import "../styles/GroupDetailsComponent.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth';

const GroupDetailsPage = () => {
  const { id_group } = useParams();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const {isAuthenticated, isOrganizer} = useContext(AuthContext);

  useEffect(() => {
    if(!isAuthenticated || !isOrganizer) {
      navigate("/");
    } else {
    //TODO implementat citirea din BD a evenimentelor care apartin grupului

    const MockEvents = [
        {
          id_eveniment: 1,
          id_grup: id_group,
          titlu_eveniment: "Eveniment 1",
          descriere_evenimen: "Descriere 1",
          data_start: "2024-12-25T10:00:00",
          data_stop: "2024-12-26T10:00:00",
          cod_acces: 1234
        },
        {
          id_eveniment: 2,
          id_grup: id_group,
          titlu_eveniment: "Eveniment 2",
          descriere_evenimen: "Descriere 2",
          data_start: "2024-12-25T10:00:00",
          data_stop: "2024-12-26T10:00:00",
          cod_acces: 1235
        }
      ];
    setEvents(MockEvents);
    }
  }, [isAuthenticated, isOrganizer, navigate, id_group]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const deleteEvent = (id_event) => {
    const updatedEventsList = events.filter(event => event.id_eveniment !== id_event);
    setEvents(updatedEventsList);
  }



  return (
    <div>
      <div className = "divHeaderButton">
      <h2>Evenimentele grupului {id_group}</h2>
      <button className='btnAddEvent' onClick={() => navigate(`/${id_group}/create-event`)}>Adauga un eveniment nou</button>
      </div>
      <ul>
        {events.map((event) => (
          <li key={event.id_eveniment}>
            <h3 onClick = {() => navigate(`/group/${id_group}/${event.id_eveniment}`)}>{event.titlu_eveniment}</h3>
            <p>  Se deschide: {formatDate(event.data_start)}</p>
            <button className="deleteEvent" onClick= {() => deleteEvent(event.id_eveniment)}>Sterge</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupDetailsPage;
