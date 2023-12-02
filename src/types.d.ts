import { ReactNode } from 'react';

interface UserProviderInterface {
    children?: ReactNode;
};

interface UserInterface {
    id: int | null;
    email: string | null;
    isAdmin: boolean;
    isLoggedIn: boolean;
};

interface UserResponseInterface {
    token: string;
    user: {
        id: int;
        email: string;
        isAdmin: boolean;
        isLoggedIn: boolean;
    };
};

interface UserContextInterface {
    token: string;
    updateToken: (token: string) => void;
    user: UserInterface;
    updateUser: (data: UserInterface) => void;
};

interface ApplicationContextInterface {
    qualcosaQui: string;
};

interface CharacterInterface {
    id: number;
    hanzi: string;
    pinyin: string;
    untoned: string;
    hasAudio: boolean;
    translation: string;
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

export { UserProviderInterface, UserInterface, UserResponseInterface, UserContextInterface, ApplicationContextInterface, CardInterface, CharacterInfoInterface, CharacterInterface };