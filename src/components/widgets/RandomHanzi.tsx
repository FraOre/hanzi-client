import { useState, useEffect, FunctionComponent, ChangeEvent } from 'react';
import { CharacterInterface } from '../../types';
import { HANZI_SERVER } from '../../settings';
import useUserContext from '../../hooks/useUserContext';
import axios from 'axios';
import Card from '../Card';

interface RandomHanziConfigInterface {
    intervalDuration: number,
    maxCharacters: number,
    playAudio: boolean,
    showHanzi: boolean,
    showPinyin: boolean,
    showTranslations: boolean,
};

const RandomHanzi: FunctionComponent = () => {
    const { token } = useUserContext();

    const [config, setConfig] = useState<RandomHanziConfigInterface>({
        intervalDuration: 5000,
        maxCharacters: 10,
        playAudio: true,
        showHanzi: true,
        showPinyin: true,
        showTranslations: true
    });
    const [started, setStarted] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(false);
    const [stopped, setStopped] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);
    const [charactersList, setCharactersList] = useState<CharacterInterface[]>([]);
    const [currentCharacter, setCurrentCharacter] = useState<CharacterInterface | null>(null);

    const handlePause = () => {
        setPaused(prevPaused => !prevPaused);
    };

    const handleStop = () => {
        setStopped(true);
    };

    useEffect(() => {
        if (started && !paused) {
            const interval = setInterval(async () => {
                const response = await axios.get(HANZI_SERVER.URL + '/characters/random', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    params: {
                        excludeIds: charactersList.map(character => character.id).join(','),
                    }
                });

                const data = response.data;
                setCurrentCharacter(data);
                setCharactersList(prevCharactersList => [...prevCharactersList, data]);
            }, config.intervalDuration);

            if (charactersList.length >= config.maxCharacters || stopped) {
                console.log('clearing interval');
                clearInterval(interval);
            }

            return () => clearInterval(interval);
        }
    }, [token, started, paused, stopped, charactersList, completed, config]);

    useEffect(() => {
        if (stopped) {
            setCompleted(true);
        }
        else if (charactersList.length >= config.maxCharacters) {
            setTimeout(() => {
                setCompleted(true);
            }, config.intervalDuration);
        }
    }, [stopped, charactersList, config]);

    useEffect(() => {
        const fetchCharacter = async () => {
            const response = await axios.get(HANZI_SERVER.URL + '/characters/random', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                params: {
                    excludeIds: charactersList.map(character => character.id).join(','),
                }
            });

            const data = response.data;
            setCurrentCharacter(data);
            setCharactersList(prevCharactersList => [...prevCharactersList, data]);
        };

        if (started && charactersList.length < 1) {
            fetchCharacter();
        }
    }, [token, started, charactersList]);

    const handleConfigChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        let integerValue = parseInt(value);

        if (name === 'intervalDuration') {
            integerValue *= 1000;
        }

        setConfig(prevConfig => ({
            ...prevConfig,
            [name]: integerValue
        }));
    };

    if (!started) {
        return (
            <>
                <label><input
                    name="showHanzi"
                    type="checkbox"
                    checked={config.showHanzi}
                    onChange={() => setConfig((prevConfig) => ({ ...prevConfig, showHanzi: !prevConfig.showHanzi }))}
                /> Show hanzi</label>
                <label><input
                    name="showPinyin"
                    type="checkbox"
                    checked={config.showPinyin}
                    onChange={() => setConfig((prevConfig) => ({ ...prevConfig, showPinyin: !prevConfig.showPinyin }))}
                /> Show pinyin</label>
                <label><input
                    name="playAudio"
                    type="checkbox"
                    checked={config.playAudio}
                    onChange={() => setConfig((prevConfig) => ({ ...prevConfig, playAudio: !prevConfig.playAudio }))}
                /> Play audio</label>
                <label><input
                    name="showTranslations"
                    type="checkbox"
                    checked={config.showTranslations}
                    onChange={() => setConfig((prevConfig) => ({ ...prevConfig, showTranslations: !prevConfig.showTranslations }))}
                /> Show translations</label>
                <input
                    type="number"
                    name="intervalDuration"
                    min={1}
                    max={10}
                    value={config.intervalDuration / 1000}
                    onChange={handleConfigChange}
                />
                <input
                    type="number"
                    name="maxCharacters"
                    min={1}
                    max={50}
                    value={config.maxCharacters}
                    onChange={handleConfigChange}
                />
                <button onClick={() => setStarted(true)}>Start</button>
            </>
        );
    }

    if (completed) {
        return (
            <>
                {charactersList.map(character =>
                    <div key={character.id}>
                        {character.hanzi} - {character.pinyin} - {character.translations.map(translation => translation.translation).join(', ')}
                    </div>
                )}
                <div>
                    <button onClick={() => {
                        setStarted(false);
                        setPaused(false);
                        setStopped(false);
                        setCompleted(false);
                        setCharactersList([]);
                        setCurrentCharacter(null);
                    }}>Restart</button>
                </div>
            </>
        );
    }

    return (
        <>
            {currentCharacter && <div>
                <Card
                    character={currentCharacter}
                    showHanzi={config.showHanzi}
                    showPinyin={config.showPinyin}
                    showTranslations={config.showTranslations}
                    playAudio={config.playAudio}
                />
            </div>}
            <div>
                <button onClick={handlePause}>{paused ? 'Resume' : 'Pause'}</button>
                <button onClick={handleStop}>Stop</button>
            </div>
        </>
    );
};

export default RandomHanzi;