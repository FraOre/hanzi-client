
import { FunctionComponent, ReactNode, createContext, useState } from 'react'
import { CharacterFilterContextInterface, CharacterFilterInterface } from '../../types/filter/character'

const CharacterFilterContext = createContext<CharacterFilterContextInterface | null>(null)

const CharacterFilterProvider: FunctionComponent<{
    children: ReactNode
}> = ({ children }) => {
    const defaultCharacterFilter: CharacterFilterInterface = {
        excluded: [],
        partsOfSpeech: [],
        pinyin: '',
        hanzi: '',
        translation: '',
        source: undefined,
        sourceFilter: undefined
    }

    const [characterFilter, setCharacterFilter] = useState<CharacterFilterInterface>(defaultCharacterFilter)

    const updateCharacterFilter = (data: CharacterFilterInterface) => {
        setCharacterFilter({
            ...characterFilter,
            ...data
        })
    }

    const resetCharacterFilter = () => {
        setCharacterFilter(defaultCharacterFilter);
    }

    return (
        <CharacterFilterContext.Provider value={{ characterFilter, updateCharacterFilter, resetCharacterFilter }}>
            {children}
        </CharacterFilterContext.Provider>
    )
}

export { CharacterFilterContext, CharacterFilterProvider }
