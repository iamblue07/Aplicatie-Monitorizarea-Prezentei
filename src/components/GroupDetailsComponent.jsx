import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import "../styles/GroupDetailsComponent.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth';

const GroupDetailsPage = () => {
  const { id_group } = useParams();
  const [events, setEvents] = useState([]);
  const [readError,setReadError]=useState('');
  const navigate = useNavigate();
  const {isAuthenticated, isOrganizer} = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated || !isOrganizer) {
      navigate("/");
    } else {
      fetch(`http://localhost:3000/api/evenimente`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((groups) =>
          setEvents(groups.filter((group) => group.id_grup === parseInt(id_group, 10)))
        ) // fetch response contains a json array
        .catch((error) => {
          setReadError("Eroare: Evenimentele nu au putut fi afisate!");
          console.error(error);
        });
    }
  }, [isAuthenticated, isOrganizer, navigate, id_group]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const deleteEvent = (id_event) => {
    fetch(`http://localhost:3000/api/evenimente/${id_event}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then(setEvents(events.filter(event => event.id_eveniment !== id_event)))
    .catch((error) => console.error("Eroare la stergere eveniment: ",error));
    
  }

  const goBack = () => {
    navigate("/Organizer");
  }



  return (
    <div>
      <button className="back-button" onClick={goBack}>Inapoi</button>
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
