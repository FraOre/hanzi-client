import { useState, useEffect, FunctionComponent, ChangeEvent } from 'react';
import { CharacterInterface } from '../../types';
import useUserContext from '../../hooks/useUserContext';
import axios from 'axios';
import Card from '../Card';

interface ConfigInterface {
    intervalDuration: number,
    maxCharacters: number,
    playAudio: boolean,
    showHanzi: boolean,
    showPinyin: boolean,
    showTranslations: boolean,
};

interface ItemInterface {
    character: CharacterInterface,
    correct: boolean,
};

const RandomHanzi: FunctionComponent = () => {
    const { token } = useUserContext();

    const [config, setConfig] = useState<ConfigInterface>({
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
    const [saved, setSaved] = useState<boolean>(false);
    const [completed, setCompleted] = useState<boolean>(false);
    const [items, setItems] = useState<ItemInterface[]>([]);
    const [item, setItem] = useState<ItemInterface | null>(null);

    const handlePause = () => {
        setPaused((prevPaused: boolean) => !prevPaused);
    };

    const handleStop = () => {
        setStopped(true);
    };

    useEffect(() => {
        if (started && !paused) {
            const interval = setInterval(async () => {
                const response = await axios.get(process.env.REACT_APP_API_URL + '/characters/random', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    params: {
                        excludeIds: items.map((item: ItemInterface) => item.character.id).join(','),
                    }
                });

                const data = response.data;

                setItem({ character: data, correct: true });
                setItems((prevItems: ItemInterface[]) => [...prevItems, { character: data, correct: true }]);
            }, config.intervalDuration);

            if (items.length >= config.maxCharacters || stopped) {
                clearInterval(interval);
            }

            return () => clearInterval(interval);
        }
    }, [token, started, paused, stopped, items, completed, config]);

    useEffect(() => {
        if (stopped) {
            setCompleted(true);
        }
        else if (items.length >= config.maxCharacters) {
            setTimeout(() => {
                setCompleted(true);
            }, config.intervalDuration);
        }
    }, [stopped, items, config]);

    useEffect(() => {
        const fetchCharacter = async () => {
            const response = await axios.get(process.env.REACT_APP_API_URL + '/characters/random', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                params: {
                    excludeIds: items.map((item: ItemInterface) => item.character.id).join(','),
                }
            });

            const data = response.data;

            setItem({ character: data, correct: true });
            setItems((prevItems: ItemInterface[]) => [...prevItems, { character: data, correct: true }]);
        };

        if (started && items.length < 1) {
            fetchCharacter();
        }
    }, [token, started, items]);

    const handleConfigChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        let integerValue = parseInt(value);

        if (name === 'intervalDuration') {
            integerValue *= 1000;
        }

        setConfig((prevConfig: ConfigInterface) => ({
            ...prevConfig,
            [name]: integerValue
        }));
    };


    const handleItemCorrentChange = (item: ItemInterface) => {
        setItems((prevItems: ItemInterface[]) =>
            prevItems.map((prevItem: ItemInterface) =>
                prevItem.character.hanzi === item.character.hanzi
                    ? { ...prevItem, correct: !prevItem.correct }
                    : prevItem
            )
        );
    };

    const saveRound = async () => {
        const response = await axios.post(process.env.REACT_APP_API_URL + '/rounds', {
            showHanzi: config.showHanzi,
            showPinyin: config.showPinyin,
            showTranslations: config.showTranslations,
            playAudio: config.playAudio,
            intervalDuration: config.intervalDuration,
            maxCharacters: config.maxCharacters,
            items: items.map((item: ItemInterface) => ({
                characterId: item.character.id,
                correct: item.correct,
            })),
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });

        if (response.data === 'ok') {
            setSaved(true);
        }
    };

    if (!started) {
        return (
            <div>
                <h5>Config</h5>
                <div>
                    <label><input
                        name="showHanzi"
                        type="checkbox"
                        checked={config.showHanzi}
                        onChange={() => setConfig((prevConfig: ConfigInterface) => ({ ...prevConfig, showHanzi: !prevConfig.showHanzi }))}
                    /> Show hanzi</label>
                </div>
                <div>
                    <label><input
                        name="showPinyin"
                        type="checkbox"
                        checked={config.showPinyin}
                        onChange={() => setConfig((prevConfig: ConfigInterface) => ({ ...prevConfig, showPinyin: !prevConfig.showPinyin }))}
                    /> Show pinyin</label>
                </div>
                <div>
                    <label><input
                        name="playAudio"
                        type="checkbox"
                        checked={config.playAudio}
                        onChange={() => setConfig((prevConfig: ConfigInterface) => ({ ...prevConfig, playAudio: !prevConfig.playAudio }))}
                    /> Play audio</label>
                </div>
                <div>
                    <label><input
                        name="showTranslations"
                        type="checkbox"
                        checked={config.showTranslations}
                        onChange={() => setConfig((prevConfig) => ({ ...prevConfig, showTranslations: !prevConfig.showTranslations }))}
                    /> Show translations</label>
                </div>
                <div>
                    <label><input
                        type="number"
                        name="intervalDuration"
                        min={1}
                        max={60}
                        value={config.intervalDuration / 1000}
                        onChange={handleConfigChange}
                    />Interval duration</label>
                </div>
                <div>
                    <label><input
                        type="number"
                        name="maxCharacters"
                        min={1}
                        max={50}
                        value={config.maxCharacters}
                        onChange={handleConfigChange}
                    />Max characters</label>
                </div>
                <button onClick={() => setStarted(true)}>Start</button>
            </div>
        );
    }

    if (completed) {
        return (
            <div>
                {items.map((item, index) =>
                    <div key={index}>
                        <div>
                            {item.character.hanzi} - {item.character.pinyin} - {item.character.translation}
                            <label><input
                                type="checkbox"
                                checked={item.correct}
                                onChange={() => handleItemCorrentChange(item)}
                            /> Corretto</label>
                        </div>
                    </div>
                )}
                <div>
                    <button onClick={() => {
                        setStarted(false);
                        setPaused(false);
                        setStopped(false);
                        setCompleted(false);
                        setSaved(false);
                        setItems([]);
                        setItem(null);
                    }}>Restart</button>
                </div>
                <div>
                    {saved ? 'Saved' : <button onClick={saveRound}>Save</button>}
                </div>
            </div>
        );
    }

    return (
        <div>
            {item && <div>
                <Card
                    character={item.character}
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
        </div>
    );
};

export default RandomHanzi;