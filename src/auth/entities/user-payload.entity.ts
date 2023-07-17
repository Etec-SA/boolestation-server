export interface UserPayload {
    sub: string;
    username: string;
    email: string;
    name: string;
    roles: {[key: string]: boolean};
    iat?: number;
    exp?: number;
}