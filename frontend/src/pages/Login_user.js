import React, { useState } from 'react';
import './Login.css';

import api from '../services/api';

export default function Login({ history }) {
    const [username, setUsername] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await api.post('/user', {
            username : username,
            summonerName : username
        });
        
        const { _id } = response.data;

        history.push(`/user/${_id}`);
    }

    return (

        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="Digite seu nome de invocador" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}  
                />
                <button type="submit">Enviar</button>
            </form>
               
        </div>
    );
}