import React, { FunctionComponent, createContext } from 'react';
import { ApplicationContextInterface } from '../types';

interface ApplicationProviderInterface {
    children?: React.ReactNode;
}

const ApplicationContext = createContext<ApplicationContextInterface | null>(null);

const ApplicationProvider: FunctionComponent<ApplicationProviderInterface> = ({ children }) => {
    const a = {
        qualcosaQui: 'qualcosa'
    };

    return (
        <ApplicationContext.Provider value={ a }>
            {children}
        </ApplicationContext.Provider>
    );
};

export { ApplicationContext, ApplicationProvider };