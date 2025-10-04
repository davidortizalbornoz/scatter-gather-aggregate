export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    lastLogin: number;
    permissions: string[];
    fullName: string;
    isActive: boolean;
    role: 'ADMIN' | 'USER';
}
