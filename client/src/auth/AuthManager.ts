import type { Router } from 'vue-router'
import { availableStrategies, type IAuthManager } from '@/interfaces/Auth'
import type { TStrategies } from '@/interfaces/Auth'
import type { ILoginUser, IUser, TRegisterForm, TSkill } from '@/interfaces/User'
import type { TAuthRenponse } from '@/interfaces/Error'
import { jwtStrategy } from './strategies/jwt.strategy'
import type { isLoginedResult } from './strategies/Strategy'
import { ALREADY_AUTHORISED_MSG } from '@/utils/constants/texts.ts'
import Manager from '@/entities/Manager'
import Company from '@/entities/Company'


export class AuthManager extends Manager implements IAuthManager {

    public availableStrategies = availableStrategies

    _strategy: TStrategies = null

    _authStore

    private _isLogined: isLoginedResult = { isLogined: false } //авторизация, любыми стратегиями

    static instance: AuthManager | null = null

    static getInstance(
        strategy?: IAuthManager['_strategy'],
        authStore?: any
    ): AuthManager {
        if (AuthManager.instance) {
            return AuthManager.instance
        }
        return new AuthManager(strategy, authStore)
    }

    protected _apiModule: string = 'auth'

    public company!: Company // Инстанс объекта компании

    private constructor(
        strategy?: IAuthManager['_strategy'],
        authStore?: any
    ) {
        super()
        if (AuthManager.instance) throw new TypeError('Instance creation only with .getInstance()')
        AuthManager.instance = this
        if (strategy) this._strategy = strategy
        this._authStore = authStore
        this._postData = this._post(this._apiModule)
        this._getData = this._get(this._apiModule)

        //при создании менеджера проверяем статус логина и разлогиниваем/убираем, если токен остался по какойто-причине старый
        void this.updateAndGetIsLogined()
            .then(async () => {
            //после проверки статуса сессии (токена) - загружаем данные юзера
            if (this.loginedStatus.isLogined) {
                this.loadInitData()
            }
        })
    }

    async loadInitData(){
        const createdUser: IUser = await this._authStore.loadUserData()
        if(createdUser.company === null || this.company) return
        //юзер загружен, цепляем к нему его компанию
        this.company = Company.getInstance (
            {
                companyId: createdUser.company.companyId,
                name     : createdUser.company.name,
                address  : createdUser.company.address,
                user     : createdUser
            }
        )
    }

    /**
     * Удаляет skillId навык из стора и из базы
     * @param skillId id навыка юзера
     */
    async removeUserSkill(skillId: TSkill['id']) {
        if(await this._postData('remove_user_skill')({skillId})) {
            this._authStore.removeSkill(skillId)
        }
    }
    /**
     * Добавляет skillText навык в стор и в базу
     * @param skillText текст навыка юзера
     */
    async addUserSkill(skillText: TSkill['skill']): Promise<boolean> {
        const res = await this._postData('add_user_skill')({
            skillText,
            userId: this.getUser().userId
        })
        if(res.data && Number.isInteger(res.data)) {
            return this._authStore.addSkill(skillText, res.data)
        }
        return false
    }

    isLogined() {
        return this.loginedStatus.isLogined
    }

    static isLoginedByJWTToken(): boolean {
        const token = jwtStrategy.token
        return !!token
    }

    static getJWTUserID(): number {
        return jwtStrategy.userId
    }

    async registerRequest(registerData: TRegisterForm): Promise<TAuthRenponse> {
        if (this._isLogined.isLogined) return { error: true, message: ALREADY_AUTHORISED_MSG }
        return await this._postData('register')(registerData, false)
    }

    public getUser(): IUser {
        return this._authStore.user
    }

    public isDirector(): boolean {
        const user: IUser = this.getUser()
        if (this.checkLoginedAndUser(user)) {
            return user.isDirector
        }
        return false
    }

    public isEmployee(): boolean {
        return !this.isDirector
    }

    public async saveUserProfile(user: IUser): Promise<boolean> {
        if (this._authStore.setUser(user)) {
            await this._postData('save_user_profile')(user)
            return true
        }
        return false
    }

    private checkLoginedAndUser(user: IUser): boolean {
        /** helper function */
        if (!this.isLogined || !user) return false
        return true
    }

    /**
     * Depends on strategy: logins current user, saving authorisation data
     * @returns saved login status or no
    */
    async loginRequest(loginData: ILoginUser): Promise<TAuthRenponse> {
        if (this._isLogined.isLogined) return { error: true, message: ALREADY_AUTHORISED_MSG }
        if (!this._strategy) return { error: true, message: 'Invalid login strategy' }

        const loginRes = await this._strategy.login(loginData)

        if (!loginRes.error) {
            this._isLogined = { isLogined: true, userId: loginRes.data.user.userId }
            //если авторизация успешна - загружаем данные юзера
            await this.loadInitData()
            this._authStore.timeLogined = Date.now()
        }

        return loginRes
    }

    get loginedStatus(): isLoginedResult {
        return this._isLogined
    }
    set loginedStatus(_someFailParameter) {
        throw new ReferenceError('Cant set isLogined directly')
    }

    /** Обновляет статус авторизации при обновлении страницы */
    async updateAndGetIsLogined(): Promise<isLoginedResult> {
        if (!this._strategy) {
            this.logOut()
            return { isLogined: false }
        }
        this._isLogined = await this._strategy.isLogined()
        if (!this._isLogined.isLogined) { this.logOut() }

        return this._isLogined
    }

    logOut(): boolean {
        if (!this._strategy) return true
        this._strategy.logOut()
        this._isLogined = { isLogined: false }
        return true
    }

    setRouteAfterLogin(router: Router): void {
        router.push({ name: 'profile' })
    }
    setRouterAfterLogOut(router: Router): void {
        router.push({ name: 'login' })
    }
}
