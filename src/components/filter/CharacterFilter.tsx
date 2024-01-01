import { useState, useEffect, FunctionComponent, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import useUserContext from '../../hooks/useUserContext';
import { LessonInterface } from '../../types/lesson';
import { CategoryInterface } from '../../types/category';
import { CharacterFilterInterface } from '../../types/filter/character';

export enum CharacterFilterField {
    LESSONS = 'lessons',
    CATEGORIES = 'categories',
    PINYIN = 'pinyin',
    HANZI = 'hanzi',
    TRANSLATION = 'translation'
};

const CharacterFilter: FunctionComponent<{
    fields: CharacterFilterField[]
    onStateChange: (filter: CharacterFilterInterface) => void
}> = ({ fields, onStateChange }) => {
    const { token } = useUserContext();

    const [lessons, setLessons] = useState<LessonInterface[]>([]);
    const [categories, setCategories] = useState<CategoryInterface[]>([]);

    const [filter, setFilter] = useState<CharacterFilterInterface>({
        excluded: [],
        lessons: [],
        categories: [],
        pinyin: '',
        hanzi: '',
        translation: ''
    });

    useEffect(() => {
        const fetchFilterData = async (): Promise<void> => {
            const lessonsResponse: AxiosResponse = await axios.get(process.env.REACT_APP_API_URL + '/lessons', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            setLessons(lessonsResponse.data as LessonInterface[]);

            const categoriesResponse: AxiosResponse = await axios.get(process.env.REACT_APP_API_URL + '/categories', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            setCategories(categoriesResponse.data as CategoryInterface[]);
        };

        fetchFilterData();
    }, [token]);

    useEffect(() => {
        onStateChange(filter);
    }, [filter, onStateChange]);

    const handleSelectFilterChange = (event: ChangeEvent<HTMLSelectElement>): void => {
        const { name, options } = event.target;
        const values = Array.from(options)
            .filter((option: HTMLOptionElement) => option.selected)
            .map((option: HTMLOptionElement) => parseInt(option.value));

        setFilter((prevFilter: CharacterFilterInterface) => ({
            ...prevFilter,
            [name]: values
        }));
    };

    const handleInputFilterChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = event.target;

        setFilter((prevFilter: CharacterFilterInterface) => ({
            ...prevFilter,
            [name]: value
        }));
    };

    return (
        <div>
            {fields.includes(CharacterFilterField.LESSONS) && <div>
                <label htmlFor="lessons">Lessons</label>
                <select name="lessons" multiple onChange={handleSelectFilterChange}>
                    {lessons.map((lesson: LessonInterface) =>
                        <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
                    )}
                </select>
                <small>Non selezionare nulla per mostrare i caratteri di tutte le lezioni</small>
            </div>}
            {fields.includes(CharacterFilterField.CATEGORIES) && <div>
                <label htmlFor="categories">Categories</label>
                <select name="categories" multiple onChange={handleSelectFilterChange}>
                    {categories.map((category: CategoryInterface) =>
                        <option key={category.id} value={category.id}>{category.name}</option>
                    )}
                </select>
                <small>Non selezionare nulla per mostrare i caratteri di tutte le categorie</small>
            </div>}
            {fields.includes(CharacterFilterField.PINYIN) && <div>
                <label htmlFor="pinyin">Pinyin</label>
                <input type="text" name="pinyin" onChange={handleInputFilterChange} />
            </div>}
            {fields.includes(CharacterFilterField.HANZI) && <div>
                <label htmlFor="hanzi">Hanzi</label>
                <input type="text" name="hanzi" onChange={handleInputFilterChange} />
            </div>}
            {fields.includes(CharacterFilterField.TRANSLATION) && <div>
                <label htmlFor="translation">Translation</label>
                <input type="text" name="translation" onChange={handleInputFilterChange} />
            </div>}
        </div>
    );
};

export default CharacterFilter;