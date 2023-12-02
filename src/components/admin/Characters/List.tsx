import { useEffect, FunctionComponent, useState } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import { CharacterInterface } from '../../../types';
import { Link } from 'react-router-dom';

const CharacterList: FunctionComponent = () => {
    const { token } = useUserContext();
    const [charactersList, setCharactersList] = useState<CharacterInterface[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + '/admin/characters', {
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
            <h1>Characters list</h1>
            <p>Number of characters: {charactersList.length}</p>
            <Link to="/admin/characters/import">Import</Link>
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