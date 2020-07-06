import React, { useState } from 'react';
import './Login.css';

import api from '../services/api';

import logo from '../assets/logo.svg';


export default function Login({ history }) {

    
    const[form, setForm] = useState({username: '', password: ''});

    
    async function handleClickLogar(e){
        e.preventDefault();
        const response = await api.post('/authenticate', {
            username: form.username,
            password: form.password,
            
        });

        const { token, _id } = response.data;
        console.log(response.data);
        history.push(`/user/${_id}/${token}`);
    }
    
    async function handleClickCadastrar(e){
        e.preventDefault();
        const response = await api.post('/user', {
            username: form.username,
            summonerName: form.username,
            password: form.password,
            
        });

        
        console.log(response.data);
        
    }

    return (

        <div className="login-container">
            <form>
                <img src={ logo } alt="MeuDuo"/> 
                <input 
                    name="username"
                    placeholder="Digite seu nome de Invocador" 
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value }) }           
                />
                <input 
                    name="password" 
                    type="password"
                    placeholder="Digite sua Senha" 
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value }) }                          
                />
                <button onClick={handleClickLogar} >Login</button>
                <button onClick={handleClickCadastrar} >Cadastrar</button>
            </form>
               
        </div>
    );
}