import { useParams } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import "../styles/CreateEventComponent.css";

const CreateEventComponent = () => {

    const { id_group } = useParams();
    const navigate = useNavigate();

    
    const {isAuthenticated, isOrganizer} = useContext(AuthContext);

    const [aT, setAT] = useState('');
    const [aD, setAD] = useState('');
    const [aDS, setADS] = useState('');
    const [aDF, setADF] = useState('');
    const [aS, setAS] = useState('');

    useEffect(() => {
        if(!isAuthenticated || !isOrganizer) {
          navigate("/");
        } else {

        }
    }, [isAuthenticated, isOrganizer, navigate, id_group]);

    const createEvent = (id_group) => {
        const titlu = document.querySelector('.inputTitlu').value;
        const descriere = document.querySelector('.inputDescriere').value;
        const dataStart = document.querySelector('.InputStart').value;
        const dataFinal = document.querySelector('.InputFinal').value;
        const id_grup = id_group;
        let valid = true;

        if (!titlu) {
            valid = false;
            setAT("Titlul evenimentului este obligatoriu!")
        } else setAT("");
        if (!descriere) {
            valid = false;
            setAD("Descrierea evenimentului este obligatorie!");
        } else setAD("");
        if (!dataStart) {
            valid = false;
            setADS("Data de început a evenimentului este obligatorie!");
        } else setADS("");
        if (!dataFinal) {
            valid = false;
            setADF("Data de final a evenimentului este obligatorie!");
        } else setADF("");

        if(valid) {
        //TODO de implementat adaugatul in BD a evenimentului
            setAS("Evenimentul a fost creat cu succes! In curs de redirectionare!");
            setTimeout(() => {
                navigate(`/group/${id_group}`);
            }, 5000);
        }
    };

    return(
        <div className="containerCreateEvent">
            <h1>Creati eveniment nou</h1>
            <div className="divTitlu">
                <p>Introduceti titlul evenimentului</p>
                <input type="text" className="inputTitlu"></input>
            </div>
            <p className='alertaTitlu'>{aT}</p>
            <div className="divDescriere">
                <p>Introduceti descrierea evenimentului</p>
                <textarea className="inputDescriere"></textarea>
            </div>
            <p className='alertaDescriere'>{aD}</p>
            <div className="divDataStart">
                <p>Introduceti data la care evenimentul se deschide</p>
                <input type="date" className="InputStart"></input>
            </div>
            <p className='alertaStart'>{aDS}</p>
            <div className="divDataFinal">
                <p>Introduceti data la care evenimentul se incheie</p>
                <input type="date" className="InputFinal"></input>
            </div>
            <p className='alertaFinal'>{aDF}</p>
            <button className="btnCreeaza" onClick={() => createEvent(id_group)}>Creeaza eveniment</button>
            <p className='alertaSucces'>{aS}</p>
        </div>

    );}

export default CreateEventComponent;
