import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import type { TSkill } from '@/interfaces/User'
import { Quasar } from 'quasar'

import UserSkills from '@/components/UserSkills.vue'

const skillsList: TSkill[] = [
    {
        id         : 1,
        skillUserId: 1,
        skill      : 'Skill 1'
    },
    {
        id         : 2,
        skillUserId: 1,
        skill      : 'Skill 2'
    },
    {
        id         : 3,
        skillUserId: 1,
        skill      : 'Skill 3'
    },
]


test('skills widget snapshot with default settings', () => {
    const wrapperFactory = () => mount(UserSkills, {
        global: {plugins: [Quasar]},
        props: {
            skills       : skillsList,
            needAssession: false,
            removable    : false,
        }
    })
    expect(wrapperFactory().find('.q-chip:nth-child(1)').html()).toMatchSnapshot()
})

test('skills widget snapshot with assertion_block', () => {
    const wrapperFactory = () => mount(UserSkills, {
        global: {plugins: [Quasar]},
        props: {
            skills       : skillsList,
            needAssession: true,
            removable    : false,
        }
    })
    expect(wrapperFactory().find('.q-chip:nth-child(2)').html()).toMatchSnapshot()
})


test('skills widget render 3 lines properly', () => {
    const wrapperFactory = () => mount(UserSkills, {
        global: {plugins: [Quasar]},
        props: {
            skills       : skillsList,
            needAssession: false,
            removable    : false,
        }
    })
    const wrapper = wrapperFactory()

    expect(wrapper.find('.q-chip:nth-child(1)').text()).equal('Skill 1')
    expect(wrapper.find('.q-chip:nth-child(2)').text()).equal('Skill 2')
    expect(wrapper.find('.q-chip:nth-child(3)').text()).equal('Skill 3')
})


test('skills widget с параметрами как в employeesList', () => {
    const enchacedSkillsList = [
        ...skillsList,
        {
            id         : 4,
            skillUserId: 1,
            skill      : 'Skill 4'
        },
        {
            id         : 5,
            skillUserId: 1,
            skill      : 'Skill 5'
        }
    ]

    const wrapperFactory = () => mount(UserSkills, {
        global: {plugins: [Quasar]},
        props: {
            skills       : enchacedSkillsList,
            needAssession: false,
            removable    : false,
            maxQuantity  : 3,
            size         : 'sm'
        }
    })
    const wrapper = wrapperFactory()
    expect(wrapper.get('.q-chip:nth-child(3)').text()).equal('Skill 3')
    expect(wrapper.get('.items-end').text()).equal('. . .')
    expect(() => wrapper.get('.q-chip:nth-child(5)').toThrowError())

})
