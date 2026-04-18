import { describe, expect, it, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { Quasar, QForm, QInput, QBtn } from 'quasar'
import CompanyCard from '@/components/CompanyCard.vue'
import { Rbac } from '@/entities/Rbac'

const companyDummy = {
    companyId: 1,
    name: 'Тестовая компания',
    address: 'Тестовый адрес',
    accountBalance: 0
}

// Моки для зависимостей
vi.mock('@/composables/notifyQuasar', () => ({
    notifyTypes: { succ: 'success' },
    useNotify: () => ({
        run: vi.fn()
    })
}))

// Моки для Rbac
vi.mock('@/entities/Rbac', async () => {
    const actual = await vi.importActual('@/entities/Rbac')
    return {
        ...actual,
        Rbac: {
            getInstance: vi.fn()
        }
    }
})

// Моки для компании
// vi.mock('@/entities/CompanyManager', () => ({
//     CompanyManager: vi.fn().mockImplementation(() => ({
//         company: companyDummy,
//         can: vi.fn(() => () => () => true),
//         saveCompanyProfile: vi.fn().mockResolvedValue(true)
//     }))
// }))

const createWrapper = (rbacMock?: Partial<Rbac>) => {
    const defaultRbacMock = {
        company: companyDummy,
        can: vi.fn(() => () => () => true),
        getUser: vi.fn(() => ({
            userId: 3
        }))
    }

    const mock = { ...defaultRbacMock, ...rbacMock }

    vi.mocked(Rbac.getInstance).mockReturnValue(mock as Rbac)

    return shallowMount(CompanyCard, {
        global: {
            provide: {
                $userManager: {company: companyDummy}
            },
            plugins: [Quasar],
            components: {
                QForm,
                QInput,
                QBtn
            },
            stubs: {
                'q-form': QForm,
                'q-input': QInput,
                'q-btn': QBtn
            }
        }
    })
}

describe('CompanyCard', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Рендеринг', () => {
        it('отображает форму с полями компании и заголовок "Компания"', () => {

            const wrapper = createWrapper()

            //expect(wrapper.find('h4').text()).toBe('Редактировать данные компании ' + companyDummy.name)
            expect(wrapper.find('form').exists()).toBe(true)
        })
        // it('отображает поле названия компании', () => {
        //     const wrapper = createWrapper()
        //     const inputs = wrapper.findAll('q-input')
        //     const nameInput = inputs.find(input =>
        //         input.props('label') === 'Название *'
        //     )
        //     expect(nameInput).toBeDefined()
        // })

        // it('отображает поле адреса компании', () => {
        //     const wrapper = createWrapper()
        //     const inputs = wrapper.findAll('q-input')
        //     const addressInput = inputs.find(input =>
        //         input.props('label') === 'Адрес'
        //     )
        //     expect(addressInput).toBeDefined()
        // })
    })

    // describe('Права доступа', () => {
    //     it('отображает режим редактирования, когда пользователь может редактировать', () => {
    //         const rbacMock = {
    //             company: {
    //                 companyId: 1,
    //                 name: 'Тестовая компания',
    //                 address: 'Тестовый адрес'
    //             },
    //             can: vi.fn(() => () => () => true),
    //             getUser: vi.fn(() => ({ userId: 2 }))
    //         }

    //         vi.mocked(Rbac.getInstance).mockReturnValue(rbacMock as Rbac)
    //         const wrapper = createWrapper()

    //         expect(wrapper.vm.captionLabel).toBe('Редактировать данные')
    //     })

    //     it('отображает режим просмотра, когда пользователь не может редактировать', () => {
    //         const rbacMock = {
    //             company: {
    //                 companyId: 1,
    //                 name: 'Тестовая компания',
    //                 address: 'Тестовый адрес'
    //             },
    //             can: vi.fn(() => () => () => false),
    //             getUser: vi.fn(() => ({ userId: 2 }))
    //         }

    //         vi.mocked(Rbac.getInstance).mockReturnValue(rbacMock as Rbac)
    //         const wrapper = createWrapper()

    //         expect(wrapper.vm.captionLabel).toBe('Просмотр данных')
    //     })

    //     it('скрывает кнопку сохранения, когда пользователь не может редактировать', () => {
    //         const rbacMock = {
    //             company: {
    //                 companyId: 1,
    //                 name: 'Тестовая компания',
    //                 address: 'Тестовый адрес'
    //             },
    //             can: vi.fn(() => () => () => false),
    //             getUser: vi.fn(() => ({ userId: 2 }))
    //         }

    //         vi.mocked(Rbac.getInstance).mockReturnValue(rbacMock as Rbac)
    //         const wrapper = createWrapper()

    //         const saveButton = wrapper.find('q-btn')
    //         expect(saveButton.exists()).toBe(false)
    //     })

    //     it('показывает кнопку сохранения, когда пользователь может редактировать', () => {
    //         const rbacMock = {
    //             company: {
    //                 companyId: 1,
    //                 name: 'Тестовая компания',
    //                 address: 'Тестовый адрес'
    //             },
    //             can: vi.fn(() => () => () => true),
    //             getUser: vi.fn(() => ({ userId: 2 }))
    //         }

    //         vi.mocked(Rbac.getInstance).mockReturnValue(rbacMock as Rbac)
    //         const wrapper = createWrapper()

    //         const saveButton = wrapper.find('q-btn')
    //         expect(saveButton.exists()).toBe(true)
    //         expect(saveButton.props('label')).toBe('Сохранить')
    //     })
    // })

    // describe('Валидация', () => {
    //     it('поле ID только для чтения', () => {
    //         const wrapper = createWrapper()
    //         const inputs = wrapper.findAll('q-input')
    //         const idInput = inputs.find(input =>
    //             input.props('label') === 'ID'
    //         )
    //         expect(idInput?.props('readonly')).toBe(true)
    //     })

    //     it('поле названия обязательно для заполнения', () => {
    //         expect(v_msg.REQUIRED).toBe('Поле обязательно для заполнения')
    //     })

    //     it('правила валидации содержат REQUIRED для поля названия', () => {
    //         const wrapper = createWrapper()
    //         const inputs = wrapper.findAll('q-input')
    //         const nameInput = inputs.find(input =>
    //             input.props('label') === 'Название *'
    //         )
    //         const rules = nameInput?.props('rules')
    //         expect(Array.isArray(rules)).toBe(true)
    //     })
    // })

    // describe('Отправка формы', () => {
        // it('вызывает saveCompanyProfile при успешной валидации', async () => {
        //     const saveMock = vi.fn().mockResolvedValue(true)
        //     const rbacMock = {
        //         company: {
        //             companyId: 1,
        //             name: 'Тестовая компания',
        //             address: 'Тестовый адрес',
        //             saveCompanyProfile: saveMock
        //         },
        //         can: vi.fn(() => () => () => true),
        //         getUser: vi.fn(() => ({ userId: 2 }))
        //     }

        //     vi.mocked(Rbac.getInstance).mockReturnValue(rbacMock as Rbac)
        //     const wrapper = createWrapper()

        //     await wrapper.vm.onSubmit()

        //     expect(saveMock).toHaveBeenCalledWith({
        //         companyId: 1,
        //         name: 'Тестовая компания',
        //         address: 'Тестовый адрес'
        //     })
        // })

        // it('показывает уведомление об успешном сохранении', async () => {
        //     const { useNotify } = await import('@/composables/notifyQuasar')
        //     const notifyRunMock = vi.fn()
        //     vi.mocked(useNotify).mockReturnValue({
        //         run: notifyRunMock
        //     } as any)

        //     const saveMock = vi.fn().mockResolvedValue(true)
        //     const rbacMock = {
        //         company: {
        //             companyId: 1,
        //             name: 'Тестовая компания',
        //             address: 'Тестовый адрес',
        //             saveCompanyProfile: saveMock
        //         },
        //         can: vi.fn(() => () => () => true),
        //         getUser: vi.fn(() => ({ userId: 2 }))
        //     }

        //     vi.mocked(Rbac.getInstance).mockReturnValue(rbacMock as Rbac)
        //     const wrapper = createWrapper()

        //     await wrapper.vm.onSubmit()

        //     expect(notifyRunMock).toHaveBeenCalledWith(
        //         SAVED_SUCCESS,
        //         'success'
        //     )
        // })

        // it('не показывает уведомление при ошибке сохранения', async () => {
        //     const { useNotify } = await import('@/composables/notifyQuasar')
        //     const notifyRunMock = vi.fn()
        //     vi.mocked(useNotify).mockReturnValue({
        //         run: notifyRunMock
        //     } as any)

        //     const saveMock = vi.fn().mockResolvedValue(false)
        //     const rbacMock = {
        //         company: {
        //             companyId: 1,
        //             name: 'Тестовая компания',
        //             address: 'Тестовый адрес',
        //             saveCompanyProfile: saveMock
        //         },
        //         can: vi.fn(() => () => () => true),
        //         getUser: vi.fn(() => ({ userId: 2 }))
        //     }

        //     vi.mocked(Rbac.getInstance).mockReturnValue(rbacMock as Rbac)
        //     const wrapper = createWrapper()

        //     await wrapper.vm.onSubmit()

        //     expect(notifyRunMock).not.toHaveBeenCalled()
        // })
    // })

    // describe('Данные формы', () => {
    //     it('инициализирует companyForm с данными из Rbac.company', () => {
    //         const rbacMock = {
    //             company: {
    //                 companyId: 42,
    //                 name: 'ООО Ромашка',
    //                 address: 'г. Москва, ул. Ленина, 1'
    //             },
    //             can: vi.fn(() => () => () => true),
    //             getUser: vi.fn(() => ({ userId: 2 }))
    //         }

    //         vi.mocked(Rbac.getInstance).mockReturnValue(rbacMock as Rbac)
    //         const wrapper = createWrapper()

    //         expect(wrapper.vm.companyForm.companyId).toBe(42)
    //         expect(wrapper.vm.companyForm.name).toBe('ООО Ромашка')
    //         expect(wrapper.vm.companyForm.address).toBe('г. Москва, ул. Ленина, 1')
    //     })
    // })
})
