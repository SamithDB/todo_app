export interface User {
    user_first_name: string;
    user_last_name: string;
    user_status: boolean;
    user_status_string: UserStatusString;
    user_type: UserType;
    user_username: string;
}

export enum UserStatusString {
    Active = 'Active',
    Pending = 'Pending',
    Deactive = 'Deactive'
}

export enum UserType {
    User = 'User',
    Admin = 'Admin'
}