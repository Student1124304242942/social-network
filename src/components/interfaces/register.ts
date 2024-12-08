export interface Register {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    country: string,
    skills: string[] | undefined,
    age: number,
}