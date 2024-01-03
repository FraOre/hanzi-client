import { HANZI_SERVER } from './settings.js'

const logged = async () => {
    try {
        const response = await fetch(HANZI_SERVER.URL + '/logged', {
            method: 'POST',
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error('Error in logged request')
        }

        const data = await response.json()
        return data
    }
    catch (error) {
        throw new Error(error)
    }
}

const logout = async () => {
    try {
        const response = await fetch(HANZI_SERVER.URL + '/logout', {
            method: 'POST',
            credentials: 'include'
        })

        if (!response.ok) {
            throw new Error('Error in logout request')
        }
    }
    catch (error) {
        throw new Error(error)
    }
}

export { logged, logout }
