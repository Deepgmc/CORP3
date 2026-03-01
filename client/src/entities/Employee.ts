import type { IUser } from "@/interfaces/User";

export class Employee implements Partial<IUser> {
    constructor(employeeData: Partial<IUser>) {
        console.log('Creating new employee:', employeeData)
    }
}
