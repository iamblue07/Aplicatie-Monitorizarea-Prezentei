import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import "../styles/EventDetailsComponent.css";

const EventDetailsComponent = () => {
    const { id_event } = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const [groupTitle, setGroupTitle] = useState("");  // Pentru a stoca titlul grupului
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { isAuthenticated, isOrganizer, userId } = useContext(AuthContext);

    useEffect(() => {
        if (!isAuthenticated || isOrganizer) {
            navigate("/"); // Redirecționăm utilizatorul dacă nu este autentificat sau este organizator
        } else {
            // Fetch pentru detaliile evenimentului
            fetch(`http://localhost:3000/api/evenimente/${id_event}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Nu am reușit să obținem detaliile evenimentului.");
                }
                return response.json();
            })
            .then((event) => {
                setEventDetails(event);

                // Fetch pentru titlul grupului utilizând id_grup
                fetch(`http://localhost:3000/api/grupuri-evenimente/${event.id_grup}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => response.json())
                .then((group) => {
                    setGroupTitle(group.titlu_grup);  // Setăm titlul grupului
                })
                .catch((error) => {
                    console.error("Eroare la obținerea titlului grupului:", error);
                });

                
                // Verificăm dacă utilizatorul este deja înregistrat
                fetch(`http://localhost:3000/api/participanti-eveniment/${id_event}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then((response) => response.json())
                .then((data) => {
                    const isRegistered = data.some(participant => participant.id_participant === userId);
                    setIsAlreadyRegistered(isRegistered);
                })
                .catch((error) => {
                    console.error("Eroare la verificarea înregistrării:", error);
                    setIsAlreadyRegistered(false); // Setăm la false în caz de eroare
                });
                
            })
            .catch((error) => {
                console.error("Eroare la obținerea detaliilor evenimentului:", error);
            });
        }
    }, [isAuthenticated, isOrganizer, id_event, navigate]);

    const registerPresence = (code) => {
        if (String(code) === String(eventDetails.cod_acces)) {
            // Dacă codul de acces este corect, înregistrăm prezența
            const participantData = {
                id_eveniment: id_event,
                id_participant: userId,
                data_confirmare: new Date().toISOString(),
            };
    
            console.log("Date trimise:", participantData); // Log pentru datele trimise
    
            fetch(`http://localhost:3000/api/participanti-eveniment/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(participantData),
            })
            .then((response) => {
                console.log("Răspuns server:", response); // Log pentru răspunsul serverului
                if (!response.ok) {
                    throw new Error("Eroare la înregistrarea prezenței.");
                }
                alert("Prezența a fost înregistrată cu succes!");
                setErrorMessage(""); // Resetăm mesajul de eroare
                navigate('/participant');
            })
            .catch((error) => {
                console.error("Eroare la înregistrarea prezenței:", error);
                setErrorMessage("A apărut o eroare la înregistrarea prezenței.");
            });
        } else {
            setErrorMessage("Codul introdus este greșit. Vă rugăm să încercați din nou.");
        }
    };
    

    return (
        <div className="evDetailsContainer">
            {eventDetails ? (
                <>
                    <p className="evDetailsTitlu">{eventDetails.titlu_eveniment}</p>
                    <p className="evDetailsGrup">Evenimentul aparține grupului <span>{groupTitle || "Se încarcă titlul grupului..."}</span></p>
                    <p className="evDetailsDescriere">Descriere:</p>
                    <p className="evDetailsDescriere"><p>{eventDetails.descriere_eveniment}</p></p>
                    <p className="evDetailsData">Evenimentul se deschide la: <span>{eventDetails.data_start}</span></p>
                    <p className="evDetailsData">Evenimentul se închide la: <span>{eventDetails.data_stop}</span></p>
                    {isAlreadyRegistered ? (
                        <>
                        <strong>Ești deja înregistrat la acest eveniment!</strong>
                        <button className="btnInapoi" onClick={() => navigate('/participant')}>Inapoi</button>
                        </>
                    ) : (
                        <div className="evDetailsDivCodAccess">
                            <p className="evDetailsCod">Introduceți codul de acces:</p>
                            <input
                                type="text"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        registerPresence(e.target.value);
                                    }
                                }}
                            />
                            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Mesaj de eroare */}
                        </div>
                    )}
                </>
            ) : (
                <p>Se încarcă detaliile evenimentului...</p> // Mesaj de încărcare temporar
            )}
        </div>
    );
};

export default EventDetailsComponent;
