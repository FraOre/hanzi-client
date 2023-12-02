import { useEffect, FunctionComponent, useState } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import { CharacterInfoInterface } from '../../../types';

const CharacterList: FunctionComponent = () => {
    const { token } = useUserContext();
    const [charactersList, setCharactersList] = useState<CharacterInfoInterface[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + '/info/characters', {
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
            <ul>
                {charactersList.map((character) => (
                    <li key={character.character.id}>
                        <strong>{character.character.hanzi}</strong> - Pinyin: {character.character.pinyin} - Rounds: {character.rounds} - Corrects: {character.corrects}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CharacterList;