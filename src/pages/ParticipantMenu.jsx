import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import "../styles/ParticipantMenu.css";

const ParticipantMenu = () => {

    const [listEvents, setListEvents] = useState([]);
    const navigate = useNavigate();
    const { isAuthenticated, isOrganizer, id_participant } = useContext(AuthContext);

    const readEventsFromDatabase = () => {
        fetch("http://localhost:3000/api/evenimente", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            // Verificăm dacă cererea a fost cu succes
            if (!response.ok) {
                throw new Error("Nu am reușit să obținem evenimentele.");
            }
            return response.json();
        })
        .then((events) => {
            // Obținem data curentă (în milisecunde)
            const currentDate = Date.now();
    
            // Filtrăm evenimentele pentru a păstra doar cele care sunt active
            const filteredEvents = events.filter(event => {
                const startDate = new Date(event.data_start).getTime(); // Convertim data_start într-un timestamp
                const endDate = new Date(event.data_stop).getTime();   // Convertim data_stop într-un timestamp
    
                // Verificăm dacă evenimentul este activ (start < data curentă < stop)
                return startDate < currentDate && endDate > currentDate;
            });
    
            // Verificăm dacă există evenimente
            if (filteredEvents && filteredEvents.length > 0) {
                // Aici poți face o conversie pentru a potrivi structura de tipul mockEvents, dacă este necesar
                const formattedEvents = filteredEvents.map(event => ({
                    id_eveniment: event.id_eveniment,
                    id_grup: event.id_grup,
                    titlu_eveniment: event.titlu_eveniment,
                    descriere_eveniment: event.descriere_eveniment,
                    data_start: event.data_start, // Asigură-te că data este formatată corect în backend
                    data_stop: event.data_stop,
                    cod_acces: event.cod_acces
                }));
    
                // Setăm evenimentele în starea componentelor
                setListEvents(formattedEvents);
            } else {
                setListEvents([]); // Dacă nu există evenimente valide, setăm lista goală
            }
        })
        .catch((error) => {
            console.error("Eroare la obținerea evenimentelor:", error);
            setListEvents([]); // Dacă apare vreo eroare, setăm lista goală
        });
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