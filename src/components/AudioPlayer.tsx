import React, { FunctionComponent, useEffect, useRef } from 'react'
import useUserContext from '../hooks/useUserContext'

interface AudioPlayerInterface {
    audioUrl: string
}

const AudioPlayer: FunctionComponent<AudioPlayerInterface> = ({ audioUrl }) => {
    const { accessToken: token } = useUserContext()

    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        let localRef: HTMLAudioElement

        if (audioRef.current) {
            localRef = audioRef.current
        }

        const fetchAudio = async () => {
            const response = await fetch(audioUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            const blob = await response.blob()
            const audioBlobUrl = URL.createObjectURL(blob)

            if (localRef) {
                localRef.src = audioBlobUrl
                localRef.play()
            }
        }

        fetchAudio()

        return () => {
            if (localRef) {
                localRef.src = ''
            }
        }
    }, [token, audioUrl])

    return <audio ref={audioRef} controls={false} />
}

export default AudioPlayer
