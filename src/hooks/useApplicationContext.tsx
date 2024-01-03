import { useContext } from 'react';
import { ApplicationContext } from '../contexts/ApplicationContext';

const useApplicationContext = () => {
    const context = useContext(ApplicationContext);

    if (!context) {
        throw new Error(
            'useApplicationContext must be used within a ApplicationProvider'
        );
    }

    return context;
};

export default useApplicationContext;
