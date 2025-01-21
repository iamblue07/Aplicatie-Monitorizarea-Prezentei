import React, { useState } from 'react';
import "../styles/CreateGroupComponent.css";
import { useNavigate } from 'react-router-dom';

const CreateGroupPage = () => {
    const [groupName, setGroupName] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        setGroupName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        //TODO adaugarea grupului in BD
        navigate("/organizer");

    };

    return (
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
                        required
                    />
                </label>
                <button className="create-group__button" type="submit">
                    Creeaza grupul
                </button>
            </form>
        </div>
    );
}

export default CreateGroupPage;
