import { useEffect, FunctionComponent, useState } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import { Link } from 'react-router-dom';
import { CharacterInterface } from '../../../types/character';

const CharactersList: FunctionComponent = () => {
    const { token } = useUserContext();
    const [charactersList, setCharactersList] = useState<CharacterInterface[]>([]);

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            const response: Response = await fetch(process.env.REACT_APP_API_URL + '/admin/characters', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (response.ok) {
                const data: CharacterInterface[] = await response.json();
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
            <table>
                <thead>
                    <tr>
                        <th>Hanzi</th>
                        <th>Pinyin</th>
                        <th>Untoned</th>
                        <th>Has audio</th>
                        <th>Lesson</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {charactersList.map((character: CharacterInterface) =>
                        <tr key={character.id}>
                            <td>{character.hanzi}</td>
                            <td>{character.pinyin}</td>
                            <td>{character.untoned}</td>
                            <td>{character.hasAudio ? 'Yes' : 'No'}</td>
                            <td>{character.lesson ? character.lesson.id + ' - ' + character.lesson.title : ''}</td>
                            <td>{character.category?.name}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CharactersList;