import { FunctionComponent } from 'react';
import { CardInterface } from '../types';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AudioPlater from './AudioPlayer';
import { HANZI_SERVER } from '../settings';

const Card: FunctionComponent<CardInterface> = ({ character, showHanzi, showPinyin, showTranslations, playAudio }) => {
    return (
        <div className="card">
            {playAudio &&  <><FontAwesomeIcon icon={faVolumeHigh} /> <AudioPlater audioUrl={HANZI_SERVER.URL + '/characters/' + character.id + '/audio'} /></>}
            {showHanzi && <div className="hanzi">{character.hanzi}</div>}
            {showPinyin && <div className="pinyin">{character.pinyin}</div>}
            {showTranslations && <div className="translation">{character.translations.map(translation => translation.translation)}</div>}
        </div>
    );
}

export default Card;
