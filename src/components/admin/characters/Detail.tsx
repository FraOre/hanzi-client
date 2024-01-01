import { FunctionComponent, useEffect, useState } from 'react';
import { CharacterInfoInterface } from '../../../types';
import useUserContext from '../../../hooks/useUserContext';
import { useParams } from 'react-router-dom';
import { CharacterInterface } from '../../../types/character';

const CharacterDetail: FunctionComponent = () => {
    const { id } = useParams();
    const { token } = useUserContext();
    const [character, setCharacter] = useState<CharacterInterface | null>(null);
    const [info, setInfo] = useState<CharacterInfoInterface | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(process.env.REACT_APP_API_URL + '/admin/characters/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const data: CharacterInterface = await response.json();
                setCharacter(data);
            }
            else {
                console.error('Errore nella richiesta API');
            }
        };

        fetchData();
    }, [token]);

    return (
        character && <div>
            <h1>Character detail</h1>
            <p>{character.hanzi}</p>
            <p>{character.pinyin}</p>
            <p>{character.untoned}</p>
            <p>{character.translation}</p>
            <p>{character.lesson && character.lesson.title}</p>
            <p>{character.category && character.category.name}</p>
        </div>
    );
};

export default CharacterDetail;