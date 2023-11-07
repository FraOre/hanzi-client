import { ReactNode } from 'react';

interface FormDataInterface {
    [key: string]: string;
};

interface UserProviderInterface {
    children?: ReactNode;
};

interface UserInterface {
    id: int | null;
    email: string | null;
    username: string | null;
    isAdmin: boolean;
    isLoggedIn: boolean;
};

interface UserResponseInterface {
    token: string;
    user: {
        id: int;
        email: string;
        username: string;
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

interface CharacterTranslationInterface {
    manguage: string;
    translation: string;
};

interface CharacterInterface {
    id: number;
    hanzi: string;
    pinyin: string;
    untoned: string;
    hasAudio: boolean;
    translations: CharacterTranslationInterface[];
};

interface CardInterface {
    character: CharacterInterface;
    showHanzi: boolean;
    showPinyin: boolean;
    showTranslations: boolean;
    playAudio: boolean;
};

export { FormDataInterface, UserProviderInterface, UserInterface, UserResponseInterface, UserContextInterface, ApplicationContextInterface, CardInterface, CharacterInterface };