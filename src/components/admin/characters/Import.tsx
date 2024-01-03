import { FunctionComponent, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import useUserContext from '../../../hooks/useUserContext';
import axios from 'axios';

interface ImportFormInterface {
    characters: CharacterInterface[];
}

interface CharacterInterface {
    hanzi: string
    pinyin: string
    untoned: string
    translation: string
    isValid: boolean
}

const CharactersImport: FunctionComponent = () => {
    const { accessToken: token } = useUserContext();

    const [characters, setCharacters] = useState<CharacterInterface[]>([]);
    const [totalErrors, setTotalErrors] = useState<number>(0);

    const { register, handleSubmit } = useForm<ImportFormInterface>()

    const handleImport: SubmitHandler<ImportFormInterface> = async data => {
        await axios
            .post<CharacterInterface[]>(process.env.REACT_APP_API_URL + '/admin/characters/import', characters, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(response => {
                window.location.href = '/admin/characters';
            }).catch(error => {
                console.log(error);
            });
    };

    const validateCharacter = (character: CharacterInterface): boolean => {
        if (!character.hanzi || !character.pinyin || !character.untoned || !character.translation) {
            return false;
        }

        if (
            character.hanzi.trim().length !== character.hanzi.length ||
            character.pinyin.trim().length !== character.pinyin.length ||
            character.untoned.trim().length !== character.untoned.length ||
            character.translation.trim().length !== character.translation.length
        ) {
            return false;
        }

        // Only characters are allowed in hanzi
        if (!/^[\u4e00-\u9fa5]+$/.test(character.hanzi)) {
            return false;
        }

        // Only letters (also with Chinese tones) are allowed in pinyin
        if (!/^[a-zA-ZĀĒĪŌŪǕÁÉÍÓÚǗǍĚǏǑǓǛÀÈÌÒÙÜāēīōūǖáéíóúǘǎěǐǒǔǜàèìòùüǚ]+$/.test(character.pinyin)) {
            return false;
        }

        // Only letters (lowercase) and numbers between 1 and 5 are allowed in untoned
        if (!/^[a-z1-5]+$/.test(character.untoned)) {
            return false;
        }

        return true;
    }

    const handlePreview = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const lines = event.target.value.split('\n');

        if (lines.length > 100) {
            event.target.value = lines.slice(0, 100).join('\n');
        }

        const value = event.target.value;

        if (value.trim() === '') {
            setCharacters([]);
            setTotalErrors(0);
            return;
        }

        const characters: CharacterInterface[] = [];

        lines.slice(0, 100).forEach(line => {
            const [hanzi, pinyin, untoned, translation] = line.split(';');
            const character: CharacterInterface = {
                hanzi: hanzi,
                pinyin: pinyin,
                untoned: untoned,
                translation: translation,
                isValid: false
            };
            character.isValid = validateCharacter(character);
            characters.push(character);
        });

        setCharacters(characters);
        setTotalErrors(characters.filter(character => !character.isValid).length);
    };

    return (
        <div>
            <h1>Import characters</h1>
            <form onSubmit={handleSubmit(handleImport)}>
                <div>
                    <h3>Characters</h3>
                    <small>Format: hanzi,pinyin,untoned,translation</small>
                    <p>
                        <textarea rows={5} cols={50} {...register('characters', { onChange: event => { handlePreview(event); }, required: true })} />
                    </p>
                </div>
                {characters.length > 0 && <div>
                    {characters.length} {characters.length > 1 ? 'characters' : 'character'} {totalErrors > 0 && <span>
                        | {totalErrors} {totalErrors > 1 ? 'errors' : 'error'} found
                    </span>}
                </div>}
                <div>
                    <h4>Preview</h4>
                    <table>
                        <thead>
                            <tr>
                                <th>Hanzi</th>
                                <th>Pinyin</th>
                                <th>Untoned</th>
                                <th>Translation</th>
                            </tr>
                        </thead>
                        <tbody>
                        {characters.map((character, index) => (
                            <tr key={index} style={{color: character.isValid ? "green" : "red"}}>
                                <td><strong>{character.hanzi}</strong></td>
                                <td>{character.pinyin}</td>
                                <td>{character.untoned}</td>
                                <td>{character.translation}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <button disabled={!characters.length || totalErrors > 0} type="submit">Import</button>
                </div>
            </form>
        </div>
    );
};

export default CharactersImport;