export interface UserPayload {
    sub: string;
    username: string;
    email: string;
    name: string;
    iat?: number;
    exp?: number;
}