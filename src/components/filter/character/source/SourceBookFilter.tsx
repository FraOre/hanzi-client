import { useState, useEffect, FunctionComponent, ChangeEvent } from 'react'
import { SourceBookFilterInterface } from '../../../../types/filter/character'
import axios, { AxiosResponse } from 'axios'
import { BookInterface, BookLessonInterface } from '../../../../types/book'
import useUserContext from '../../../../hooks/useUserContext'
import useCharacterFilterContext from '../../../../hooks/filter/useCharacterFilterContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { Tooltip } from '@mantine/core'

const SourceBookFilter: FunctionComponent = () => {
    const { accessToken: token } = useUserContext()
    const { characterFilter, updateCharacterFilter } = useCharacterFilterContext()

    const [books, setBooks] = useState<BookInterface[]>([])
    const [bookLessons, setBookLessons] = useState<BookLessonInterface[]>([])

    useEffect(() => {
        const fetchBooks = async (): Promise<void> => {
            const booksResponse: AxiosResponse = await axios.get(process.env.REACT_APP_API_URL + '/book/all', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })

            setBooks(booksResponse.data as BookInterface[])
        };

        fetchBooks()
    }, [token])

    const handleBookFilterChange = async (event: ChangeEvent<HTMLSelectElement>): Promise<void> => {
        const { value } = event.target

        if (value) {
            const bookId = parseInt(value)

            updateCharacterFilter({
                ...characterFilter,
                sourceFilter: {
                    ...characterFilter.sourceFilter as SourceBookFilterInterface,
                    book: bookId
                }
            })

            const bookLessonsResponse: AxiosResponse = await axios.get(process.env.REACT_APP_API_URL + '/book/' + bookId + '/lessons', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })

            setBookLessons(bookLessonsResponse.data as BookLessonInterface[])
        }
        else {
            updateCharacterFilter({
                ...characterFilter,
                sourceFilter: undefined
            })

            setBookLessons([])
        }
    };

    const handleBookLessonsFilterChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        const { options } = event.target;
        const values = Array.from(options)
            .filter((option: HTMLOptionElement) => option.selected)
            .map((option: HTMLOptionElement) => parseInt(option.value))

        updateCharacterFilter({
            ...characterFilter,
            sourceFilter: {
                ...characterFilter.sourceFilter as SourceBookFilterInterface,
                lessons: values
            }
        })
    }

    return (
        <div>
            <div>
                <label htmlFor="book">
                    Book
                    <Tooltip
                        withArrow
                        multiline
                        w={220}
                        label='Non selezionare nulla per mostrare i caratteri di tutti i libri'
                    >
                        <FontAwesomeIcon className="tip" icon={faCircleInfo} />
                    </Tooltip>
                </label>
                <select name="book" onChange={handleBookFilterChange}>
                    <option value="">Seleziona</option>
                    {books.map((book: BookInterface) =>
                        <option key={book.id} value={book.id}>{book.title}</option>
                    )}
                </select>
            </div>
            {characterFilter.sourceFilter as SourceBookFilterInterface !== undefined && <div>
                <label htmlFor="lessons">
                    Lessons
                    <Tooltip
                        withArrow
                        multiline
                        w={220}
                        label='Non selezionare nulla per mostrare i caratteri di tutte le lezioni'
                    >
                        <FontAwesomeIcon className="tip" icon={faCircleInfo} />
                    </Tooltip>
                </label>
                <select name="lessons" multiple onChange={handleBookLessonsFilterChange}>
                    {bookLessons.map((bookLesson: BookLessonInterface) =>
                        <option key={bookLesson.id} value={bookLesson.id}>{bookLesson.number} - {bookLesson.title}</option>
                    )}
                </select>

            </div>}
        </div>
    )
}

export default SourceBookFilter
