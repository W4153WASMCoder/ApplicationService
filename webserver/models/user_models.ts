export interface UserModel {
    UserID: number | null;
    sub: string; // Unique identifier from the OpenID provider
    email: string;
    name: string;
    picture: string;
    lastLogin: Date;
}

export interface ActiveToken {
    TokenID: number | null;
    UserID: number;
    TTL: number;
    CreationDate: Date;
}
