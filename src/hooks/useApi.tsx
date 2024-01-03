import axios, { AxiosResponse } from 'axios'
import { useState, useEffect, useCallback } from 'react'
import useUserContext from './useUserContext'

interface ApiResponse<T> {
    data: T | null
    loading: boolean
    error: string | null
    fetchData: () => void
}

const useApi = <T,>(url: string, fetchOnLoad: boolean = true): ApiResponse<T> => {
    console.log('useApi')
    const { accessToken } = useUserContext()

    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response: AxiosResponse<T> = await axios.get(process.env.REACT_APP_API_URL + url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            setData(response.data)
        }
        catch (err) {
            setError('An error occurred while fetching data')
        }
        finally {
            setLoading(false)
        }
    }, [accessToken, url])

    useEffect(() => {
        if (fetchOnLoad) {
            fetchData()
        }
    }, [fetchData, fetchOnLoad])

    return { data, loading, error, fetchData }
}

export default useApi
