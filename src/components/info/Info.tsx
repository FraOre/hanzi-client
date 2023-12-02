import { FunctionComponent } from 'react';
import CharacterList from './characters/List';

const Info: FunctionComponent = () => {
    return (
        <div>
            <h1>Info</h1>
            <div>
                <CharacterList />                
            </div>
        </div>
    );
};

export default Info;