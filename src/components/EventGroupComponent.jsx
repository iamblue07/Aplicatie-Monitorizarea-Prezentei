import React, {useEffect, useContext} from "react";
import "../styles/EventGroupComponent.css";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../hooks/useAuth";



const EventGroupComponent = ({ id_group, group_name, onGroupDelete, downloadGroupList }) => {

  const {isAuthenticated, isOrganizer} = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect( () => {
    if(!isAuthenticated || !isOrganizer) {
      navigate("/");
    }
  }, [isAuthenticated, isOrganizer, navigate]);




  return (
    <div className="EventGroupComponent">
      <span className="GroupID">{id_group}</span>
      <span className="GroupName" onClick = {() => navigate(`/group/${id_group}`)}>{group_name}</span>
      <button className="DeleteButton" onClick={() => onGroupDelete(id_group)}>
        Sterge
      </button>
      <button className="DownloadButton" onClick={() => downloadGroupList(id_group)}>
        Descarca lista
      </button>
    </div>
  );
};

export default EventGroupComponent;
