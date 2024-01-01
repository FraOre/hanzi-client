interface UserInterface {
    id: int | null;
    email: string | null;
    isAdmin: boolean;
    isLoggedIn: boolean;
};

interface UserResponseInterface {
    token: string;
    user: {
        id: int;
        email: string;
        isAdmin: boolean;
        isLoggedIn: boolean;
    };
};

export { UserInterface, UserResponseInterface };