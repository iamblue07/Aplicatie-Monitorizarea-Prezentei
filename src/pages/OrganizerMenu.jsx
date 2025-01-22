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
    //TODO  descarcare
  }

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
