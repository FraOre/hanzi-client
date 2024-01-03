import { useState, useEffect, FunctionComponent, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import useUserContext from '../../../hooks/useUserContext';
import { SourceFilter } from '../../../types/filter/character';
import SourceBookFilter from './source/SourceBookFilter';
import useCharacterFilterContext from '../../../hooks/filter/useCharacterFilterContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Grid, Tooltip } from '@mantine/core';
import { PartOfSpeechInterface } from '../../../types/part-of-speech';

export enum CharacterFilterField {
    PARTS_OF_SPEECH = 'parts_of_speech',
    PINYIN = 'pinyin',
    HANZI = 'hanzi',
    TRANSLATION = 'translation',
    SOURCE = 'source',
};

const CharacterFilter: FunctionComponent<{
    fields: CharacterFilterField[]
}> = ({ fields }) => {
    const { accessToken: token } = useUserContext()
    const { characterFilter, updateCharacterFilter } = useCharacterFilterContext()

    const [partsOfSpeech, setPartsOfSpeech] = useState<PartOfSpeechInterface[]>([])

    useEffect(() => {
        const fetchPartsOfSpeech = async (): Promise<void> => {
            const partsOfSpeechResponse: AxiosResponse = await axios.get(process.env.REACT_APP_API_URL + '/part-of-speech/all'/*, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            }*/)

            setPartsOfSpeech(partsOfSpeechResponse.data as PartOfSpeechInterface[])
        }

        fetchPartsOfSpeech()
    }, [token])

    const handlePartsOfSpeechFilterChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        const { options } = event.target;
        const values = Array.from(options)
            .filter((option: HTMLOptionElement) => option.selected)
            .map((option: HTMLOptionElement) => option.value)

        updateCharacterFilter({
            ...characterFilter,
            partsOfSpeech: values
        })
    }

    const handleSourceFilterChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        const { options } = event.target

        updateCharacterFilter({
            ...characterFilter,
            source: options[options.selectedIndex].value as SourceFilter,
            sourceFilter: undefined
        })
    }

    const handlePinyinFilterChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target

        updateCharacterFilter({
            ...characterFilter,
            pinyin: value
        })
    }

    const handleHanziFilterChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target

        updateCharacterFilter({
            ...characterFilter,
            pinyin: value
        })
    }

    const handleTranslationFilterChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target

        updateCharacterFilter({
            ...characterFilter,
            translation: value
        })
    }

    return (
        <Grid>
            <Grid.Col span={{ md: 6 }}>
                {fields.includes(CharacterFilterField.PARTS_OF_SPEECH) && <div>
                    <label htmlFor="parts-of-speech">
                        Parts of speech
                        <Tooltip
                            withArrow
                            multiline
                            w={220}
                            label='Non selezionare nulla per mostrare i caratteri di tutte le parti del discorso'
                        >
                            <FontAwesomeIcon className="tip" icon={faCircleInfo} />
                        </Tooltip>
                    </label>
                    <select name="parts-of-speech" multiple onChange={handlePartsOfSpeechFilterChange}>
                        {partsOfSpeech.map((partOfSpeech: PartOfSpeechInterface) =>
                            <option key={partOfSpeech.publicId} value={partOfSpeech.publicId}>{partOfSpeech.name}</option>
                        )}
                    </select>
                </div>}
            </Grid.Col>
            <Grid.Col span={{ md: 6 }}>
                {fields.includes(CharacterFilterField.SOURCE) && <div>
                    <div>
                        <label htmlFor="source">
                            Source
                            <Tooltip
                                withArrow
                                multiline
                                w={220}
                                label='Non selezionare nulla per mostrare i caratteri di tutte le sorgenti'
                            >
                                <FontAwesomeIcon className="tip" icon={faCircleInfo} />
                            </Tooltip>
                        </label>
                        <select name="source" onChange={handleSourceFilterChange}>
                            <option value="">Seleziona</option>
                            <option value="HSK">HSK</option>
                            <option value="Book">Book</option>
                        </select>
                    </div>
                    {characterFilter.source === 'Book' && <div>
                        <SourceBookFilter />
                    </div>}
                </div>}
                {fields.includes(CharacterFilterField.PINYIN) && <div>
                    <label htmlFor="pinyin">Pinyin</label>
                    <input type="text" name="pinyin" onChange={handlePinyinFilterChange} />
                </div>}
                {fields.includes(CharacterFilterField.HANZI) && <div>
                    <label htmlFor="hanzi">Hanzi</label>
                    <input type="text" name="hanzi" onChange={handleHanziFilterChange} />
                </div>}
                {fields.includes(CharacterFilterField.TRANSLATION) && <div>
                    <label htmlFor="translation">Translation</label>
                    <input type="text" name="translation" onChange={handleTranslationFilterChange} />
                </div>}
            </Grid.Col>
        </Grid>
    )
}

export default CharacterFilter