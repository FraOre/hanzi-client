import { FunctionComponent } from 'react'
import { CharacterCardInterface } from '../types'
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AudioPlater from './AudioPlayer'
import { Card, Text } from '@mantine/core'

const CharacterCard: FunctionComponent<CharacterCardInterface> = ({
    character,
    showHanzi,
    showPinyin,
    showTranslations,
    playAudio
}) => {
    return (
        <div>
            <Card
                shadow='sm'
                padding='lg'
                withBorder
            >
                {showHanzi && <Text size='xl' ta='center'>
                    {character.hanzi}
                </Text>}
                {showPinyin && <Text size='l'>
                    {character.pinyin}
                </Text>}

                {playAudio &&  <>
                    <FontAwesomeIcon icon={faVolumeHigh} /> <AudioPlater audioUrl={process.env.REACT_APP_API_URL + '/character/' + character.publicId + '/audio'} />
                </>}
                {showTranslations && <div className="translation">{character.translation}</div>}
            </Card>
        </div>
    )
}

export default CharacterCard
