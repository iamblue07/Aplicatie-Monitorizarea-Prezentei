import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import "../styles/ParticipantMenu.css";

const ParticipantMenu = () => {

    const [listEvents, setListEvents] = useState([]);
    const navigate = useNavigate();
    const { isAuthenticated, isOrganizer } = useContext(AuthContext);

    const readEventsFromDatabase = () => {

        //TODO de implementat citirea evenimentelor marcate OPEN din baza de date
        const mockEvents = [
            {   
                id_eveniment: 1,
                id_grup: 11,
                titlu_eveniment: "Eveniment 1",
                descriere_evenimen: "Descriere 1",
                data_start: "2024-12-25T10:00:00",
                data_stop: "2024-12-26T10:00:00",
                cod_acces: 1234
            },
            {
                id_eveniment: 2,
                id_grup: 22,
                titlu_eveniment: "Eveniment 2",
                descriere_evenimen: "Descriere 2",
                data_start: "2024-12-25T10:00:00",
                data_stop: "2024-12-26T10:00:00",
                cod_acces: 1235
            },
            {   
                id_eveniment: 3,
                id_grup: 33,
                titlu_eveniment: "Eveniment 3",
                descriere_evenimen: "Descriere 3",
                data_start: "2024-12-25T10:00:00",
                data_stop: "2024-12-26T10:00:00",
                cod_acces: 1236
            }
        ];
        setListEvents(mockEvents);
    };

    useEffect( () => {
        if(isAuthenticated && isOrganizer === false) {
            readEventsFromDatabase();
        } else {
            navigate("/");
        }
    }, [isAuthenticated, isOrganizer, navigate]);

    const access_event = (id_eveniment) => {
            navigate(`/events/${id_eveniment}`);
    }

    const scanQR = () => {
        //TODO implementat scanarea unui cod
    }

    return (<>
        <div className="ContainerParticipantMenu">
            <h2 className="headingParticipantMenu">Evenimente deschise in acest moment</h2>
            <div className="Events-List">
            {listEvents.map((ev) => (
                <div key={ev.id_eveniment} className="div-event">
                    <strong>ID:</strong> {ev.id_eveniment}
                    <strong>Nume:</strong> 
                    <p onClick={() => access_event(ev.id_eveniment)} className="Event-Link">{ev.titlu_eveniment}</p>
                    <strong>Deschis:</strong> {ev.data_start}
                    <strong>Închis:</strong> {ev.data_stop}
                </div>
            ))}
            </div>
            <button className="btnScanQR" onClick={() => scanQR()}>Scanati un cod QR</button>
        </div>
    </>);
};
export default ParticipantMenu;