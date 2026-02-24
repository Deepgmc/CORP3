import type { IUserManager } from "@/interfaces/User"
import { UserManager } from "./UserManager"

export const enum pmEditList {
    EDIT_COMPANY = 'EDIT_COMPANY',
    EDIT_EMPLOYEE = 'EDIT_EMPLOYEE'
}
export const enum pmViewList {
    VIEW_COMPANY = 'VIEW_COMPANY',
    VIEW_EMPLOYEE = 'VIEW_EMPLOYEE'
}

/**
 * наследник юзера - расширяет его функциями ролей и доступов
 */
export class Rbac extends UserManager {

    static instance: Rbac | null = null

    private readonly roles: TRoles[] = []
    private ADMIN_ID = 1

    static getInstance(
        strategy?: IUserManager['_strategy'],
        userStore?: any
    ): Rbac {
        if (Rbac.instance) {
            return Rbac.instance
        }
        return new Rbac(strategy, userStore)
    }

    constructor(
        strategy?: IUserManager['_strategy'],
        userStore?: any
    ){
        super(strategy, userStore)
        if (Rbac.instance) {
            throw new TypeError('Instance creation only with .getInstance()')
        }
        Rbac.instance = this


        //при создании менеджера проверяем статус логина и разлогиниваем/убираем, если токен остался по какойто-причине старый
        void this.updateAndGetIsLogined()
            .then(async () => {
                //после проверки статуса сессии (токена) - загружаем данные юзера
                if (this.loginedStatus.isLogined) {
                    this.loadInitData()
                    .then(() => {
                        this.initRoles()
                    })
                }
            })
    }

    private initRoles(){
        if(this.isDirector()) this.addRole(new ManagerRole())
        if(this.isEmployee()) this.addRole(new EmployeeRole())
        const user = this.getUser()
        if(user.userId === this.ADMIN_ID) this.addRole(new AdminRole())
        if(this.roles.length === 0) this.addRole(new GuestRole())
    }

    addRole(newRole: TRoles){
        this.roles.push(newRole)
    }

    getRoles(){
        return this.roles
    }

    public can(accessment: TPermissions): boolean {
        return this.roles.some((role: TRoles) => {
            return role.hasPermission(accessment)
        })
    }
}

type TRoles = AdminRole | ManagerRole | EmployeeRole | GuestRole
type TPermissions = pmEditList | pmViewList

export class Role {
    public readonly name: string
    public readonly priority: number
    public readonly permissions: TPermissions[] = []

    hasPermission(accessment: TPermissions): boolean {
        return this.permissions.includes(accessment)
    }

    constructor(name: string, priority: number) {
        this.name = name
        this.priority = priority
    }
}

export class AdminRole extends Role {
    constructor(){
        super('admin', 0)
    }
    public readonly permissions = [
        pmEditList.EDIT_COMPANY,
        pmEditList.EDIT_EMPLOYEE,

        pmViewList.VIEW_COMPANY,
        pmViewList.VIEW_EMPLOYEE
    ]
}
export class ManagerRole extends Role {
    constructor(){
        super('manager', 1)
    }
    public readonly permissions = [
        pmEditList.EDIT_EMPLOYEE,

        pmViewList.VIEW_COMPANY,
        pmViewList.VIEW_EMPLOYEE
    ]
}
export class EmployeeRole extends Role {
    constructor(){
        super('employee', 2)
    }
    public readonly permissions = [
        pmViewList.VIEW_COMPANY,
    ]
}
export class GuestRole extends Role {
    constructor(){
        super('guest', 3)
    }
    public readonly permissions = []
}

