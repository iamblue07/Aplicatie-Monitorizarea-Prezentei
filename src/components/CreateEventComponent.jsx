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

        const submitBtn=document.querySelector('.btnCreeaza');
    
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
        if(dataFinal<dataStart) {
            valid = false;
            setADF("Data de final a evenimentului trebuie să fie după data de început!");
        }
    
        if(valid) {
        const newEvent={id_grup,
            titlu_eveniment: titlu, 
            descriere_eveniment: descriere, 
            data_start: dataStart, 
            data_stop: dataFinal,
            cod_acces: Math.random().toString(36).substring(2, 10)};    
            console.log(JSON.stringify(newEvent));
    
            fetch(`http://localhost:3000/api/evenimente`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(newEvent),
            })
            .then((response)=>response.json())
            .then((data)=>{
                console.log("Response data: ", data);
                if(data.id_eveniment){
                    submitBtn.disabled=true;
                    submitBtn.style.backgroundColor="grey";
                    submitBtn.style.cursor="not-allowed";
                    setAS("Evenimentul a fost creat cu succes! In curs de redirectionare!");
                    setTimeout(() => {
                        navigate(`/group/${id_group}`);
                    }, 3000);
                } else{
                    setAS("Eroare la crearea evenimentului!");
                    console.error("Error: ", data.error);
                }
            }).catch((error)=>{
                console.error("Error: ",error);
                setAS("Eroare la crearea evenimentului!");
            })
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
                <input type="datetime-local" className="InputStart"></input>
            </div>
            <p className='alertaStart'>{aDS}</p>
            <div className="divDataFinal">
                <p>Introduceti data la care evenimentul se incheie</p>
                <input type="datetime-local" className="InputFinal"></input>
            </div>
            <p className='alertaFinal'>{aDF}</p>
            <button className="btnCreeaza" onClick={() => createEvent(id_group)}>Creeaza eveniment</button>
            <p className='alertaSucces'>{aS}</p>
        </div>

    );}

export default CreateEventComponent;
