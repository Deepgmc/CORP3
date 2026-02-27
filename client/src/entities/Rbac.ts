import type { IUserManager } from "@/interfaces/User"
import { UserManager } from "./UserManager"

/**
 * наследник юзера - расширяет его функциями ролей и доступов
 */
export class Rbac extends UserManager {

    static instance: Rbac | null = null

    private readonly roles: Set<TRoles> = new Set()
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
                        this.printRoles()
                    })
                }
            })
    }

    private initRoles(){
        if(this.isDirector()) this.addRole(new ManagerRole())
        if(this.isEmployee()) this.addRole(new EmployeeRole())
        const user = this.getUser()
        if(user.userId === this.ADMIN_ID) this.addRole(new AdminRole())
        if(this.roles.size === 0) this.addRole(new GuestRole())
    }

    addRole(newRole: TRoles){
        this.roles.add(newRole)
    }

    printRoles(){
        //выводим в консоль всю инфу о роли и правах доступа
        console.group('Roles')
        this.roles.forEach((role) => {
            console.log(`%c --- ${role.name} ---`, 'background:rgb(0, 48, 4); color: #e1e43b; padding: 4px;')
            const permissions = []
            for(const [entity, value1] of Object.entries(role.permissions)) {
                permissions.push('\n' + entity.toUpperCase() + ':')
                for(const [action, value2] of Object.entries(value1)) {
                    permissions.push('(' + action.toUpperCase() + '):')
                    permissions.push(value2.join(', '))
                }
            }
            console.log(`%c Permissions: ${permissions.join(' ')}`, 'color: #e1e43b; padding: 4px;')
        })
        console.groupEnd()
    }

    /**
     * Смотрим роли пользователя, проверяем можно ему делать что-то или нет
       В доступах ролей есть структура, разбитая на сущности системы, на действия и конкретные поля доступа
     * @param entity сущности системы - департаменты, пользователи, компании и т.д.
       @param action что нельзя делать - смотреть, редактировать, вращать, красить в красный цвет и т.п.
       @param field конкретный доступ к чему-либо (например к имени департамента)
     * @returns boolean, можно или нельзя
     */
    public can(entity: R_ENTITIES): (action: R_ACTIONS) => (field: R_FIELDS) => boolean {
        let hasAccess = false
        return (action: R_ACTIONS): (field: R_FIELDS) => boolean => {
            return (field: R_FIELDS): boolean => {
                this.roles.forEach((role: TRoles) => {
                    if(typeof role.permissions[entity] === 'undefined' || typeof role.permissions[entity][action] === 'undefined') return
                    const accessments = role.permissions[entity][action]

                    if(accessments.indexOf(field) !== -1) hasAccess = true
                })
                return hasAccess
            }
        }
    }

    getRoles(){
        return this.roles
    }
}

type TRolePermissions = {
    [entity in R_ENTITIES] ?: {
        [action in R_ACTIONS] ?: R_FIELDS[]
    }
};


export enum R_ENTITIES {
    COMPANY    = 'company',
    DEPARTMENT = 'department',
    EMPLOYEE   = 'employee',
}

export enum R_ACTIONS {
    EDIT = 'edit',
    VIEW = 'view',
    ADD  = 'add',
}

export enum R_FIELDS {
    ENTIRE = 'entire',
    NAME   = 'name',
}
type TRoles = AdminRole | ManagerRole | EmployeeRole | GuestRole

export class Role {
    public readonly name: string
    public readonly priority: number
    public readonly permissions !: TRolePermissions

    constructor(name: string, priority: number) {
        this.name = name
        this.priority = priority
    }
}

export class AdminRole extends Role {
    constructor(){
        super('admin', 0)
    }
    public readonly permissions: TRolePermissions = {
        [R_ENTITIES.DEPARTMENT]: {
            [R_ACTIONS.VIEW]: [
                R_FIELDS.ENTIRE,
                R_FIELDS.NAME,
            ],
            [R_ACTIONS.ADD]: [
                R_FIELDS.ENTIRE
            ]
        },
        [R_ENTITIES.COMPANY]: {
            [R_ACTIONS.EDIT]: [
                R_FIELDS.ENTIRE
            ],
            [R_ACTIONS.VIEW]: [
                R_FIELDS.ENTIRE,
                R_FIELDS.NAME,
            ],
        },
        [R_ENTITIES.EMPLOYEE]: {
            [R_ACTIONS.VIEW]: [
                R_FIELDS.ENTIRE
            ],
        },
    }
}
export class ManagerRole extends Role {
    constructor(){
        super('manager', 1)
    }
    public readonly permissions: TRolePermissions = {
        [R_ENTITIES.DEPARTMENT]: {
            [R_ACTIONS.ADD]: [
                R_FIELDS.ENTIRE
            ]
        }
    }
}
export class EmployeeRole extends Role {
    constructor(){
        super('employee', 2)
    }
    public readonly permissions: TRolePermissions = {}
}
export class GuestRole extends Role {
    constructor(){
        super('guest', 3)
    }
    public readonly permissions: TRolePermissions = {}
}
