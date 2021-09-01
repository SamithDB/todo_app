export interface Register {
    first_name: string,
    last_name: string, 
    username: string, 
    password: string, 
    user_type: UserType
}

export enum UserType {
    User = 'User',
    Admin = 'Admin'
}