import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../hooks/useAuth";
import "../styles/EventDetailsComponent.css";

const EventDetailsComponent = () => {

    const {id_event} = useParams();
    const [eventDetails, setEventDetails] = useState(null);
    const navigate = useNavigate();
    const {isAuthenticated, isOrganizer} = useContext(AuthContext);
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if(!isAuthenticated || isOrganizer) {
          navigate("/");
        } else {
            //TODO de citit detaliile evenimentului din BD
            const mockEventDetails = {
                id_eveniment: 1,
                id_grup: 11,
                titlu_eveniment: "Eveniment 1",
                descriere_eveniment: "Descriere 1",
                data_start: "2024-12-25T10:00:00",
                data_stop: "2024-12-26T10:00:00",
                cod_acces: 1234
            }
            setEventDetails(mockEventDetails);

            //TODO de verificat in BD daca utilizatorul si-a inregistrat deja prezenta
            setIsAlreadyRegistered(false);
        };
    }, [isAuthenticated, isOrganizer, navigate]);

    const registerPresence = (code) => {
        if (parseInt(code, 10) === eventDetails.cod_acces) {
            //TODO de inregistrat prezenta in baza de date
            setErrorMessage("");
            alert("Prezența a fost înregistrată cu succes!");
        } else {
            setErrorMessage("Codul introdus este greșit. Vă rugăm să încercați din nou.");
        }
    }

    return (
        <div className="evDetailsContainer">
            {eventDetails ? (
                <>
                    <p className="evDetailsTitlu">{eventDetails.titlu_eveniment}</p>
                    <p className="evDetailsGrup">Evenimentul aparține grupului <span>{eventDetails.id_grup}</span></p>
                    <p className="evDetailsDescriere">Descriere:</p>
                    <p className="evDetailsDescriere"><p>{eventDetails.descriere_eveniment}</p></p>
                    <p className="evDetailsData">Evenimentul se deschide la: <span>{eventDetails.data_start}</span></p>
                    <p className="evDetailsData">Evenimentul se închide la: <span>{eventDetails.data_stop}</span></p>
                    {isAlreadyRegistered ? (
                        <strong>Ești deja înregistrat la acest eveniment!</strong>
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
    
}

export default EventDetailsComponent;