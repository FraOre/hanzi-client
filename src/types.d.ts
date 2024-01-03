export interface UserContextInterface {
    user: UserInterface
    updateUser: (data: LoginUserInterface) => void
    logoutUser: () => void
    accessToken: string
    updateAccessToken: (token: string) => void
}

export interface ApplicationContextInterface {
    qualcosaQui: string
}

export interface CharacterInfoInterface {
    character: CharacterInterface
    rounds: number
    corrects: number
}

export interface CharacterCardInterface {
    character: CharacterInterface
    showHanzi: boolean
    showPinyin: boolean
    showTranslations: boolean
    playAudio: boolean
}
