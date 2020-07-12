import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import itsamatch from '../assets/itsamatch.png'

function iconURL(iconID) {
    return `/assets_riot/profileicon/${iconID}.png`
}

function emblemURL(tierName) {

    if (!tierName || tierName === 'Unranked')
        return '/assets_riot/ranked-emblems/Unranked.png'
    else
        return `/assets_riot/ranked-emblems/Emblem_${tierName}.png`
}

export default function Main({ match, history }) {
    const [users, setUsers] = useState([]);
    const [matchUser, setMatchUser] = useState(null);

    const token = "Bearer ".concat(match.params.token);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/user', {
                headers: {
                    authorization: token,
                }
            });
            //cria um objeto para acessar diretamente os dados do elo
            response.data.forEach((u) => {
                const emblems = {}
                if (u.league.length)
                    u.league.forEach((elem) => {
                        emblems[elem.queueType] = { tier: elem.tier, rank: elem.rank }
                    })
                //adiciona informação de unranked
                if (!emblems.RANKED_SOLO_5x5)
                    emblems.RANKED_SOLO_5x5 = { tier: 'Unranked', rank: '' }

                if (!emblems.RANKED_FLEX_SR)
                    emblems.RANKED_FLEX_SR = { tier: 'Unranked', rank: '' }

                u.emblems = emblems;

            })
            console.log(response.data)
            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]);

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('match', invocador => {
            setMatchUser(invocador);
        })

    }, [match.params.id]);

    async function handleLike(invocadorId) {
        await api.post(`user/${invocadorId}/likes`, null, {
            headers: { 
                authorization: token,
            },
        })

        setUsers(users.filter(user => user._id !== invocadorId));
    }

    async function handleDislike(invocadorId) {
        await api.post(`user/${invocadorId}/dislikes`, null, {
            headers: { 
                authorization: token,
            },
        })

        setUsers(users.filter(user => user._id !== invocadorId));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img className="logo" src={logo} alt="MeuDuo" />
            </Link>
            <button onClick={() => history.push(`/profile/${token}`)}>Meu Perfil</button>
            {users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <footer>
                                <div className="emblem-div">
                                    <div className="emblem-mode">
                                        <img className="emblem" src={emblemURL(user.emblems.RANKED_SOLO_5x5.tier)} alt={user.emblems.RANKED_SOLO_5x5.tier} />
                                        <div className="tier-name" >
                                            {user.emblems.RANKED_SOLO_5x5.tier} {user.emblems.RANKED_SOLO_5x5.rank}
                                        </div>
                                    </div>
                                    <div className="emblem-mode">
                                        <img className="emblem" src={emblemURL(user.emblems.RANKED_FLEX_SR.tier)} alt={user.emblems.RANKED_FLEX_SR.tier} />
                                        <div className="tier-name">
                                            {user.emblems.RANKED_FLEX_SR.tier} {user.emblems.RANKED_FLEX_SR.rank}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="infoUsers">
                                    <div className="infoLol">
                                        <img className="icon" src={iconURL(user.profileIconId)} alt="icone de invocador" />
                                        <p>{user.summonerLevel}</p>
                                        <strong>{user.username}</strong>
                                    </div>
                                    <div className="infoInsta">
                                        <img className="icon" src={user.avatarInstagram} alt="avatar instagram" />
                                        <p>{user.idade}</p>
                                        <strong>{user.userInstagram}</strong>
                                    </div>
                                </div>
                                

                                
                                
                            </footer>

                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike" />
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like" />
                                </button>
                            </div>
                        </li>

                    ))}
                </ul>
            ) : (
                    <div className="empty">Acabou  :(</div>
                )}

            {matchUser && (
                <div className="match-container">
                    <img src={itsamatch} alt="It's a match" />

                    <img className="avatar" src={iconURL(matchUser.profileIconId)} alt="" />
                    <strong> {matchUser.username} </strong>
                    <p> {matchUser.bio} </p>

                    <button type="button" onClick={() => setMatchUser(null)}>FECHAR</button>
                </div>
            )}

        </div>
    )
}