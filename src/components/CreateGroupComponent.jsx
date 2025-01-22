import React, { useState } from 'react';
import "../styles/CreateGroupComponent.css";
import { useNavigate } from 'react-router-dom';

const CreateGroupPage = () => {
    const [groupName, setGroupName] = useState('');
    const [AG, setAG] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setGroupName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const numeGrup = document.querySelector('.create-group__input').value;
        const alertMessage = document.querySelector('.status_message');
        const submitBtn=document.querySelector('.create-group__button');

        if (!numeGrup) {
            alertMessage.style.color = "red";
            setAG("Numele grupului este obligatoriu!");
        } else {
            const newGroup = { titlu_grup: numeGrup };
            fetch(`http://localhost:3000/api/grupuri-evenimente`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newGroup),
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.id_grup) {
                    alertMessage.style.color = "green";
                    submitBtn.disabled=true;
                    submitBtn.style.backgroundColor="grey";
                    submitBtn.style.cursor="not-allowed";
                    setAG("Grupul de evenimente a fost creat cu succes! Veti fi redirectionat inapoi la lista de grupuri!");
                    setTimeout(() => {
                        navigate(`/organizer`);
                    }, 3000);
                } else {
                    setAG("Eroare la crearea grupului de evenimente");
                }
            })
            .catch((error) => {
                console.error("Eroare la crearea grupului de evenimente: ", error);
            });
        }
    };

    return (
        <div>
            <div className="create-group">
                <form onSubmit={handleSubmit}>
                    <label>
                        Introduceti numele grupului:
                        <input
                            className="create-group__input"
                            type="text"
                            value={groupName}
                            onChange={handleInputChange}
                            placeholder="Numele grupului"
                        />
                    </label>
                    <button className="create-group__button" type="submit">
                        Creeaza grupul
                    </button>
                </form>
            </div>
            <p className="status-message">{AG}</p>
        </div>
    );
}

export default CreateGroupPage;
