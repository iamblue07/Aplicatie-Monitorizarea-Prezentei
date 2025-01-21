import React, { useState, useEffect, useContext } from "react";
import EventGroupComponent from "../components/EventGroupComponent";
import "../styles/OrganizerMenu.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";

const OrganizerMenu = () => {
  const [eventGroups, setEventGroups] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, isOrganizer } = useContext(AuthContext);

  const readGroupsDataBase = () => {
    // TODO: de implementat citirea tuturor grupurilor din baza de date
    
    const mockData = [
      { id_group: 1, group_name: "Group 1" },
      { id_group: 2, group_name: "Group 2" },
      { id_group: 3, group_name: "Group 3" },
    ];
    setEventGroups(mockData);
  };

  const onGroupDelete = (id_group) => {
    // TODO: de implementat stergerea unui grup si a tuturor evenimentelor atasate lui din baza de date
    const updatedGroups = eventGroups.filter(group => group.id_group !== id_group);
    setEventGroups(updatedGroups);
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
        {eventGroups.map(group => ( //da, aici m-am complicat nitel mai mult. Abia intelesesem ce fac. Dar eh, cred ca e mai profesionala metoda asta
          <EventGroupComponent      //in rest am mapat normal, spre exemplu in GroupDetailsComponent
            key={group.id_group}
            id_group={group.id_group}
            group_name={group.group_name}
            onGroupDelete={onGroupDelete}
            downloadGroupList={downloadGroupList}
          />
        ))}
      </div>
    </div>
  );
};

export default OrganizerMenu;
