export type SourceFilter = 'HSK' | 'Book'

export interface CharacterFilterInterface {
    excluded: string[]
    partsOfSpeech: string[]
    pinyin: string
    hanzi: string
    translation: string
    source?: SourceFilter
    sourceFilter?: SourceHskFilterInterface | SourceBookFilterInterface
}

export interface SourceHskFilterInterface {
    hsk?: number[]
}

export interface SourceBookFilterInterface {
    book?: number
    lessons?: number[]
}

export interface CharacterFilterContextInterface {
    characterFilter: CharacterFilterInterface
    updateCharacterFilter: (data: CharacterFilterInterface) => void
    resetCharacterFilter: () => void
}
