export interface LoginUserInterface {
    id: number
    email: string
    isAdmin: boolean
}

export interface LoginResponseInterface {
    loginUser: LoginUserInterface
    accessToken: string
}

export interface RefreshResponseInterface extends LoginResponseInterface {}
