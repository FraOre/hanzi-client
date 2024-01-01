interface UserContextInterface {
    token: string;
    updateToken: (token: string) => void;
    user: UserInterface;
    updateUser: (data: UserInterface) => void;
};

interface ApplicationContextInterface {
    qualcosaQui: string;
};

interface CharacterInfoInterface {
    character: CharacterInterface;
    rounds: number;
    corrects: number;
};

interface CardInterface {
    character: CharacterInterface;
    showHanzi: boolean;
    showPinyin: boolean;
    showTranslations: boolean;
    playAudio: boolean;
};

export { UserContextInterface, ApplicationContextInterface, CardInterface, CharacterInfoInterface };