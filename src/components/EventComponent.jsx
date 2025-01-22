import { useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import "../styles/EventComponent.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../hooks/useAuth';
import QRCode from 'qrcode';

const EventComponent = () => {
  const { id_group, id_event } = useParams();
  const [event, setEvent] = useState({
    titlu_eveniment: '',
    descriere_eveniment: '',
    data_start: '',
    data_stop: ''
  });
  const [listaOpen, setListaOpen] = useState(false);
  const [idParticipanti, setIdParticipanti] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [AG, setAG] = useState('');
  const { isAuthenticated, isOrganizer } = useContext(AuthContext);
  const [isQrEnlarged, setIsQrEnlarged] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setEvent(prevEvent => ({ ...prevEvent, titlu_eveniment: e.target.value }));
  };

  const handleDescriptionChange = (e) => {
    setEvent(prevEvent => ({ ...prevEvent, descriere_eveniment: e.target.value }));
  };

  const handleStartDateChange = (e) => {
    setEvent(prevEvent => ({ ...prevEvent, data_start: e.target.value }));
  };

  const handleStopDateChange = (e) => {
    setEvent(prevEvent => ({ ...prevEvent, data_stop: e.target.value }));
  };

  const saveChanges = () => {
    const titlu= document.querySelector('.inputTitlu').value;
    const descriere= document.querySelector('.inputDescriere').value;
    const dataStart= document.querySelector('.InputStart').value;
    const dataFinal= document.querySelector('.InputFinal').value;
    const saveBtn=document.querySelector('.saveBtn');
    const statusLabel=document.querySelector('.update-status');
    let valid = true;

    if (!titlu || !dataStart || !dataFinal) {
      valid = false;
      statusLabel.style.color = "red";
      setAG("Campuri incomplete: " + (titlu ? "" : "Titlu eveniment, ") + (dataStart ? "" : "Data start, ") + (dataFinal ? "" : "Data stop"));
    }
    if(dataStart>dataFinal) {
      valid=false;
      statusLabel.style.color = "red";
      setAG("Data de final a evenimentului trebuie să fie după data de început!");
    }

    if (valid) {
      const updatedEvent={
        id_grup: id_group,
        titlu_eveniment: titlu,
        descriere_eveniment: descriere,
        data_start: dataStart,
        data_stop: dataFinal
      }

      fetch(`http://localhost:3000/api/evenimente/${id_event}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          saveBtn.disabled=true;
          saveBtn.style.backgroundColor="grey";
          saveBtn.style.cursor="not-allowed";
          statusLabel.style.color = "green";
          setAG("Evenimentul a fost actualizat cu succes! In curs de redirectionare!");
          setTimeout(() => {
              navigate(`/group/${id_group}`);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error: ", error);
          statusLabel.style.color = "red";
          setAG("Eroare la actualizarea evenimentului!");
        });
    }
  };

  const readParticipants = (id_event) => {
    if (!listaOpen) {
      fetch(`http://localhost:3000/api/participanti-eveniment/${id_event}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Eroare la obținerea participanților evenimentului!");
          }
          return response.json();
        })
        .then((participantiEveniment) => {
          // Obține datele tuturor participanților folosind Promise.all
          const requests = participantiEveniment.map((entry) =>
            fetch(`http://localhost:3000/api/participanti/${entry.id_participant}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Eroare la obținerea detaliilor participantului cu ID: ${entry.id_participant}`);
                }
                return response.json().then((participant) => ({
                  id_participant: participant.id_participant,
                  nume: participant.nume,
                  prenume: participant.prenume,
                  data_confirmare: entry.data_confirmare,
                }));
              })
          );
  
          return Promise.all(requests);
        })
        .then((listaParticipanti) => {
          setParticipants(listaParticipanti);
          setListaOpen(true);
        })
        .catch((error) => {
          console.error(error);
          setAG("Eroare la citirea listei de participanți!");
        });
    } else {
      setListaOpen(false);
      setParticipants([]);
    }
  };
  
  const downloadParticipants = (id_event) => {
    fetch(`http://localhost:3000/api/participanti-eveniment/${id_event}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((participants) => {
        const listaParticipanti = [];
  
        const fetchPromises = participants.map((id) => {
          return fetch(`http://localhost:3000/api/participanti/${id.id_participant}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((participant) => {
              listaParticipanti.push({
                id_participant: participant.id_participant,
                nume: participant.nume,
                prenume: participant.prenume,
                data_confirmare: id.data_confirmare,
              });
            });
        });
  
        Promise.all(fetchPromises)
          .then(() => {
            // Creare fișier CSV
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "ID Participant,Nume,Prenume,Data Confirmare\n";
  
            listaParticipanti.forEach((p) => {
              csvContent += `${p.id_participant},${p.nume},${p.prenume},${p.data_confirmare}\n`;
            });
  
            // Creare link pentru descărcare
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `participanti_event_${id_event}.csv`);
            document.body.appendChild(link);
  
            link.click();
            document.body.removeChild(link);
          })
          .catch((error) => {
            console.error("Eroare la preluarea listei de participanți:", error);
            setAG("Eroare descărcare lista participanți!");
          });
      })
      .catch((error) => {
        console.error("Eroare la preluarea participanților evenimentului:", error);
        setAG("Eroare descărcare lista participanți!");
      });
  };
  
  const generateQR = (cod_acces) => {
      QRCode.toDataURL(cod_acces)
        .then(url => setQrCodeUrl(url))
        .catch(error => console.error("QR Code generation error:", error));
    };

  useEffect(() => {
    console.log("id_group:", id_group, "id_eveniment:", id_event);
    if (!isAuthenticated || !isOrganizer) {
      navigate("/");
    } else {
      fetch(`http://localhost:3000/api/evenimente/${id_event}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json()).then(event => {
        setEvent(event);
        generateQR(event.cod_acces);
      }).catch((error) => {
        setAG("Eroare citire eveniment!");
        console.error(error);
      });
    }
  }, [id_group, id_event, isAuthenticated, isOrganizer, navigate]);

  const toggleQrEnlargement = () => {
    setIsQrEnlarged(!isQrEnlarged);
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-details">
      <h2 style={{ textAlign: "center" }}>{event.titlu_eveniment}</h2>

      <div>
        <label>Titlu Eveniment:</label>
        <input className='inputTitlu'
          type="text"
          value={event.titlu_eveniment}
          onChange={handleTitleChange}
        />
      </div>

      <div>
        <label>Descriere Eveniment:</label>
        <input className='inputDescriere'
          type="text"
          value={event.descriere_eveniment}
          onChange={handleDescriptionChange}
        />
      </div>

      <div>
        <label>Data Start:</label>
        <input className='InputStart'
          type="datetime-local"
          value={event.data_start}
          onChange={handleStartDateChange}
        />
      </div>

      <div>
        <label>Data Stop:</label>
        <input className='InputFinal'
          type="datetime-local"
          value={event.data_stop}
          onChange={handleStopDateChange}
        />
      </div>
      
      <div>
        <button className="saveBtn" onClick={saveChanges} style={{ width: "100%" }}>Save Changes</button>
        <p className="update-status">{AG}</p>
      </div>

      <div>
      <img
          src={qrCodeUrl}
          alt={event.cod_acces}
          className={isQrEnlarged ? 'qr-code enlarged' : 'qr-code'}
          onClick={toggleQrEnlargement}
        />
        <p className='access-code'>Cod de acces: {event.cod_acces}</p>
      </div>

      <div>
        <button className="btn-usersList" onClick={ () => readParticipants(id_event)} style={{ width: "100%" }}> Vezi lista participantilor </button>
        <div className="div-usersList">
          {participants.length > 0 ? (
            <ul>
              {participants.map((participant) => (
                <li key={participant.id_participant}>
                  <strong>{participant.nume} {participant.prenume}</strong> S-a conectat la: {participant.data_confirmare}
                </li>
              ))}
            </ul>
          ) : (
            <p></p>
          )}
        </div>
        <button className="btn-CSV" onClick={ () => downloadParticipants(id_event)} style={{ width: "100%" }}>Descarca lista participantilor</button>
      </div>
    </div>
  );
};

export default EventComponent;