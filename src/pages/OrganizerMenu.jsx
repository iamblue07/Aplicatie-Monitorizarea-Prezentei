import React, { useState, useEffect, useContext } from "react";
import EventGroupComponent from "../components/EventGroupComponent";
import "../styles/OrganizerMenu.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";

const OrganizerMenu = () => {
  const [eventGroups, setEventGroups] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, isOrganizer } = useContext(AuthContext);
  const [readError,setReadError]=useState('');

  const readGroupsDataBase = () => {
    fetch(`http://localhost:3000/api/grupuri-evenimente`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response)=>response.json()).then((groups)=>setEventGroups(groups)) //fetch response contains a json array
      .catch((error)=>{
        setReadError("Eroare: Grupurile nu au putut fi afisate!");
        console.error(error);
      });
  };

  const onGroupDelete = (id_group) => {
    fetch(`http://localhost:3000/api/grupuri-evenimente/${id_group}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the group");
        }
        return response.json();
      })
      .then(() => {
        // Update state only after a successful deletion
        setEventGroups((prevGroups) =>
          prevGroups.filter((group) => group.id_grup !== id_group)
        );
      })
      .catch((error) => console.error("Eroare la stergere grup: ", error));
  };

  const downloadGroupList = (id_group) => {
    // 1. Fetch la evenimentele grupului
    fetch(`http://localhost:3000/api/evenimente/grup/${id_group}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((evenimente) => {
        const listaEvenimente = [];
  
        // 2. Iterăm prin evenimentele grupului și facem fetch la participanți pentru fiecare eveniment
        const fetchPromises = evenimente.map((eveniment) => {
          return fetch(`http://localhost:3000/api/participanti-eveniment/${eveniment.id_eveniment}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then((participanti) => {
              // 3. Adăugăm participanții în listaEvenimente
              const fetchParticipantiPromises = participanti.map((id) => {
                return fetch(`http://localhost:3000/api/participanti/${id.id_participant}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                  .then((response) => response.json())
                  .then((participant) => {
                    listaEvenimente.push({
                      id_eveniment: eveniment.id_eveniment,
                      titlu_eveniment: eveniment.titlu_eveniment,
                      id_participant: participant.id_participant,
                      nume_participant: participant.nume,
                      prenume_participant: participant.prenume,
                      data_confirmare: id.data_confirmare,  // Folosim data_confirmare în loc de email
                    });
                  })
                  .catch((error) => {
                    console.error(`Eroare la preluarea detaliilor participantului ${id.id_participant}:`, error);
                  });
              });
  
              // Așteptăm să finalizăm toate fetch-urile pentru participanți
              return Promise.all(fetchParticipantiPromises);
            })
            .catch((error) => {
              console.error(`Eroare la preluarea participanților pentru evenimentul ${eveniment.id_eveniment}:`, error);
            });
        });
  
        // 3. Așteptăm finalizarea tuturor fetch-urilor
        Promise.all(fetchPromises)
          .then(() => {
            // 4. Creăm conținutul CSV
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "ID Eveniment,Titlu Eveniment,ID Participant,Nume Participant,Prenume Participant,Data Confirmare\n";
  
            listaEvenimente.forEach((row) => {
              csvContent += `${row.id_eveniment},${row.titlu_eveniment},${row.id_participant},${row.nume_participant},${row.prenume_participant},${row.data_confirmare}\n`;
            });
  
            // 5. Creăm un link pentru descărcare
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `lista_participanti_grup_${id_group}.csv`);
            document.body.appendChild(link);
  
            // 6. Simulăm click-ul pe link pentru a descărca fișierul
            link.click();
            document.body.removeChild(link);
  
            console.log('Fișierul CSV a fost descărcat cu succes!');
          })
          .catch((error) => {
            console.error("Eroare la procesarea datelor:", error);
          });
      })
      .catch((error) => {
        console.error("Eroare la obținerea evenimentelor grupului:", error);
      });
  };
  
  
  
  
  
  
  

  useEffect(() => {
    if(isAuthenticated && isOrganizer)
      readGroupsDataBase();
    else {
      navigate("/");
    }
  }, [isAuthenticated, isOrganizer, navigate]); //se ruleaza useEffect() de fiecare data cand se modifica una din valori

  return (
    <div className="Organizer-container">
      <div className="HeaderAndButton">
        <h2>Selectati grupul de evenimente</h2>
        <button className="Add-Group" onClick={() => navigate("/create-group")}> Adaugati un grup nou</button>
      </div>
      <div className="Event-Group">
        {eventGroups.map(group => (
          <EventGroupComponent
            key={group.id_grup}
            id_group={group.id_grup}
            group_name={group.titlu_grup}
            onGroupDelete={onGroupDelete}
            downloadGroupList={downloadGroupList}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizerMenu;
