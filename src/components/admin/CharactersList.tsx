import React, { useEffect, FunctionComponent, useState } from 'react';
import { HANZI_SERVER } from '../../settings';
import useUserContext from '../../hooks/useUserContext';
import { CharacterInterface } from '../../types';

const CharacterList: FunctionComponent = () => {
    const { token } = useUserContext();
    const [charactersList, setCharactersList] = useState<CharacterInterface[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(HANZI_SERVER.URL + '/admin/characters', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCharactersList(data);
            }
            else {
                console.error('Errore nella richiesta API');
            }
        };

        fetchData();
    }, [token]);

    return (
        <div>
            <h1>Lista Caratteri</h1>
            <ul>
                {charactersList.map((char) => (
                    <li key={char.id}>
                        <strong>{char.hanzi}</strong> - Pinyin: {char.pinyin} - Untoned: {char.untoned} - Has audio: {char.hasAudio ? 'true' : 'false'} 
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CharacterList;