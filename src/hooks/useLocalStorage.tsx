import { useEffect, useState, Dispatch, SetStateAction } from "react";

export default function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        }
        catch (error) {
            return defaultValue;
        }
    });

    useEffect(() =>
        localStorage.setItem(key, JSON.stringify(value)), [value, key]
    );

    const setValueWrap: Dispatch<SetStateAction<T>> = (newValue) => {
        setValue((prevValue) => {
            const updatedValue = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prevValue) : newValue;
            localStorage.setItem(key, JSON.stringify(updatedValue));
            return updatedValue;
        });
    };

    return [value, setValueWrap];
}