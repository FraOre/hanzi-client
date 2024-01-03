import { useState, useEffect, FunctionComponent, useCallback } from 'react'
import axios, { AxiosResponse } from 'axios'
import CharacterCard from '../CharacterCard'
import { CharacterInterface } from '../../types/character'
import CharacterFilter, { CharacterFilterField } from '../filter/character/CharacterFilter'
import useCharacterFilterContext from '../../hooks/filter/useCharacterFilterContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo, faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons'
import { Switch, Button, Grid, NumberInput, Tooltip, Text } from '@mantine/core'

interface ConfigInterface {
    intervalDuration: number
    maxCharacters: number
    playAudio: boolean
    showHanzi: boolean
    showPinyin: boolean
    showTranslations: boolean
}

interface ItemInterface {
    character: CharacterInterface
    correct: boolean
}

const RandomHanzi: FunctionComponent = () => {
    const { characterFilter, updateCharacterFilter, resetCharacterFilter } = useCharacterFilterContext()

    const defaultConfig: ConfigInterface = {
        intervalDuration: 5000,
        maxCharacters: 10,
        playAudio: true,
        showHanzi: true,
        showPinyin: true,
        showTranslations: true
    }

    const [config, setConfig] = useState<ConfigInterface>(defaultConfig)
    const [started, setStarted] = useState<boolean>(false)
    const [paused, setPaused] = useState<boolean>(false)
    const [stopped, setStopped] = useState<boolean>(false)
    const [saved, setSaved] = useState<boolean>(false)
    const [completed, setCompleted] = useState<boolean>(false)
    const [items, setItems] = useState<ItemInterface[]>([])
    const [item, setItem] = useState<ItemInterface | null>(null)
    // const [progressValue, setProgressValue] = useState<number>(0)

    const fetchRandomCharacter = useCallback(async () => {
        const response: AxiosResponse = await axios.get(process.env.REACT_APP_API_URL + '/character/random', {
            params: characterFilter
        })

        const data: CharacterInterface = response.data

        const randomItem: ItemInterface = {
            character: data,
            correct: true
        }

        setItem(randomItem)
        setItems((prevItems: ItemInterface[]) => [
            ...prevItems,
            randomItem
        ])

        updateCharacterFilter({
            ...characterFilter,
            excluded: [
                ...(characterFilter.excluded || []),
                data.publicId
            ]
        })
    }, [characterFilter, updateCharacterFilter])


    useEffect(() => {
        if (started && !paused && !stopped) {
            if (items.length === 0) {
                fetchRandomCharacter()
            }
            else {
                const interval = setInterval(() => {
                    if (items.length < config.maxCharacters) {
                        fetchRandomCharacter()
                    }
                }, config.intervalDuration)
        
                if (items.length >= config.maxCharacters) {
                    clearInterval(interval)
                    setTimeout(() => setCompleted(true), config.intervalDuration)
                }
        
                return () => clearInterval(interval)
            }
        }
        else if (stopped) {
            setCompleted(true)
        }
    }, [started, paused, stopped, items, config, fetchRandomCharacter])

    const handlePause = (): void => {
        setPaused((prevPaused: boolean) => !prevPaused)
    }

    const handleStop = (): void => {
        setStopped(true)
    }

    const handleIntervalDurationConfigChange = (value: string | number) => {
        setConfig((prevConfig: ConfigInterface) => ({
            ...prevConfig,
            intervalDuration: value as number * 1000
        }))
    }

    const handleMaxCharactersConfigChange = (value: string | number) => {
        setConfig((prevConfig: ConfigInterface) => ({
            ...prevConfig,
            maxCharacters: value as number
        }))
    }

    const handleItemCorrectChange = (item: ItemInterface) => {
        setItems((prevItems: ItemInterface[]) =>
            prevItems.map((prevItem: ItemInterface) =>
                prevItem.character.hanzi === item.character.hanzi
                    ? {
                        ...prevItem,
                        correct: !prevItem.correct
                    }
                    : prevItem
            )
        )
    }

    const resetConfig = () => {
        setConfig(defaultConfig)
    }

    const resetWidget = () => {
        setStarted(false)
        setPaused(false)
        setStopped(false)
        setCompleted(false)
        setSaved(false)
        setItems([])
        setItem(null)
    }

    const handleReset = () => {
        resetWidget()
        resetConfig()
        resetCharacterFilter()
    }

    const handleRestart = () => {
        resetWidget()
        updateCharacterFilter({
            ...characterFilter,
            excluded: []
        })
        setStarted(true)
    }

    const saveRound = async () => {
        const response: AxiosResponse = await axios.post(process.env.REACT_APP_API_URL + '/rounds', {
            /*showHanzi: config.showHanzi,
            showPinyin: config.showPinyin,
            showTranslations: config.showTranslations,
            playAudio: config.playAudio,
            intervalDuration: config.intervalDuration,
            maxCharacters: config.maxCharacters,*/
            ...config,
            items: items.map((item: ItemInterface) => ({
                characterId: item.character.publicId,
                correct: item.correct,
            }))
        }/*, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }*/)

        if (response.status === 200) {
            setSaved(true)
        }
    }

    if (!started) {
        return (
            <div>
                <Grid>
                    <Grid.Col span={{ md: 8 }}>
                        <div className='filter'>
                            <h5>Filter</h5>
                            <CharacterFilter
                                fields={[
                                    CharacterFilterField.PARTS_OF_SPEECH,
                                    CharacterFilterField.SOURCE
                                ]}
                            />
                        </div>
                    </Grid.Col>
                    <Grid.Col span={{ md: 4 }}>
                        <div className='config'>
                            <h5>Config</h5>
                            <div>
                                <Switch
                                    checked={config.showHanzi}
                                    onChange={() => {
                                        setConfig((prevConfig: ConfigInterface) => ({
                                            ...prevConfig,
                                            showHanzi: !prevConfig.showHanzi
                                        }))
                                    }}
                                    label='Show hanzi'
                                />
                            </div>
                            <div>
                                <Switch
                                    checked={config.showPinyin}
                                    onChange={() => {
                                        setConfig((prevConfig: ConfigInterface) => ({
                                            ...prevConfig,
                                            showPinyin: !prevConfig.showPinyin
                                        }))
                                    }}
                                    label='Show pinyin'
                                />
                            </div>
                            <div>
                                <Switch
                                    checked={config.playAudio}
                                    onChange={() => {
                                        setConfig((prevConfig: ConfigInterface) => ({
                                            ...prevConfig,
                                            playAudio: !prevConfig.playAudio
                                        }))
                                    }}
                                    label='Play audio'
                                />
                            </div>
                            <div>
                                <Switch
                                    checked={config.showTranslations}
                                    onChange={() => {
                                        setConfig((prevConfig: ConfigInterface) => ({
                                            ...prevConfig,
                                            showTranslations: !prevConfig.showTranslations
                                        }))
                                    }}
                                    label='Show translations'
                                />
                            </div>
                            <div>
                                <NumberInput
                                    label={
                                        <>
                                            <span>Interval duration</span>
                                            <Tooltip
                                                withArrow
                                                multiline
                                                w={220}
                                                label='Durata in secondi tra un carattere e un altro'
                                            >
                                                <FontAwesomeIcon className='tip' icon={faCircleInfo} />
                                            </Tooltip>
                                        </>
                                    }
                                    min={1}
                                    max={60}
                                    defaultValue={config.intervalDuration / 1000}
                                    onChange={handleIntervalDurationConfigChange}
                                />
                            </div>
                            <div>
                                <NumberInput
                                    label={
                                        <>
                                            <span>Max characters</span>
                                            <Tooltip
                                                withArrow
                                                multiline
                                                w={220}
                                                label='Numero massimo di caratteri da mostrare'
                                            >
                                                <FontAwesomeIcon className='tip' icon={faCircleInfo} />
                                            </Tooltip>
                                        </>
                                    }
                                    min={1}
                                    max={50}
                                    defaultValue={config.maxCharacters}
                                    onChange={handleMaxCharactersConfigChange}
                                />
                            </div>
                        </div>
                    </Grid.Col>
                </Grid>
                <Button onClick={() => setStarted(true)}>Start</Button>
            </div>
        )
    }

    if (completed) { 
        return (
            <div>
                {items.map((item, index) =>
                    <div key={index}>
                        <div>
                            {item.character.hanzi} - {item.character.pinyin} - {item.character.translation}
                            <label><input
                                type='checkbox'
                                checked={item.correct}
                                onChange={() => handleItemCorrectChange(item)}
                            /> Corretto</label>
                        </div>
                    </div>
                )}
                <div>
                    <Button onClick={handleReset}>Reset</Button>
                </div>
                <div>
                    <Button onClick={handleRestart}>Restart</Button>
                </div>
                <div>
                    {saved ? 'Saved' : <Button onClick={saveRound}>Save</Button>}
                </div>
            </div>
        )
    }

    return (
        <div>
            {item && <div style={{ width: 340, margin: 'auto' }}>
                <div>
                    <Text>
                        {items.length} / {config.maxCharacters}
                    </Text>
                </div>
                <CharacterCard
                    character={item.character}
                    showHanzi={config.showHanzi}
                    showPinyin={config.showPinyin}
                    showTranslations={config.showTranslations}
                    playAudio={config.playAudio}
                />
                {/* <Progress
                    size='sm'
                    radius='sm'
                    value={100 - progressValue}
                /> */}
            </div>}
            <div>
                <Button onClick={handlePause}>{
                    paused ?
                        <>
                            <FontAwesomeIcon icon={faPlay} /> Play
                        </> :
                        <>
                            <FontAwesomeIcon icon={faPause} /> Pause
                        </>
                }</Button>
                <Button onClick={handleStop}>
                    <FontAwesomeIcon icon={faStop} /> Stop
                </Button>
            </div>
        </div>
    )
}

export default RandomHanzi
