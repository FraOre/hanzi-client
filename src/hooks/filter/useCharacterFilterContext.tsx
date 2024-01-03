import { useContext } from 'react';
import { CharacterFilterContext } from '../../contexts/filter/CharacterFilterContext';

const useCharacterFilterContext = () => {
    const context = useContext(CharacterFilterContext);

    if (!context) {
        throw new Error(
            'useCharacterFilterContext must be used within a CharacterFilterProvider'
        );
    }

    return context;
};

export default useCharacterFilterContext;
