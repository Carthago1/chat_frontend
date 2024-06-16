export interface User {
    id: number;
    username: string;
}

export interface UserState {
    user: User | null;
    authorized: boolean;
}
