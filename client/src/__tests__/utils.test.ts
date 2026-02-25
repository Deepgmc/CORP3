import { describe, expect, test, vi } from 'vitest'
import { convertTSToStr, convertStrToUnixTimestamp, getAgeFromTS } from '@/utils/helpers/dates'
import type { TError } from '@/interfaces/Error'

describe('Тесты утилит: Dates.ts', () => {

    const dateErr: TError = {
        error: true,
        errorMessage: 'Неверный формат даты'
    }

    test.each([
        {testDate: '01.01.1990', expected: {error:false, res: 631141200}},
        {testDate: '25.01.1990', expected: {error:false, res: 633214800}},
        {testDate: '1990.01.25', expected: {error:false, res: 633214800}},

        {testDate: '01-01-1990', expected: {error:false, res: 631141200}},
        {testDate: '25-01-1990', expected: {error:false, res: 633214800}},
        {testDate: '1990-01-25', expected: {error:false, res: 633214800}},

        {testDate: '01/01/1990', expected: {error:false, res: 631141200}},
        {testDate: '25/01/1990', expected: {error:false, res: 633214800}},
        {testDate: '1990/01/25', expected: {error:false, res: 633214800}},

        {testDate: '631141200', expected: dateErr},
        {testDate: '633214800', expected: dateErr},

        {testDate: 'gfhfgh', expected: dateErr},
        {testDate: '', expected: dateErr},

    ])('convertStrToUnixTimestamp, получить из строки таймстамп $testDate -> $expected', ({testDate, expected}) => {
        expect(convertStrToUnixTimestamp(testDate)).toEqual(expected)
    })

    test('convertTSToStr, Получить из таймстампа строку', () => {
        vi.setSystemTime(new Date('1990-01-01'))
        const ts = Date.now()

        const convertedDate = convertTSToStr(ts)
        const wrongConvertedDate = convertTSToStr('25.25.1990')

        expect(convertedDate).toBe('01.01.1990')
        expect(wrongConvertedDate).toBe(false)

        vi.useRealTimers()
    })

    test.each([
        {testTS: 577440000000, expected: 37},
        {testTS: 1745053200000, expected: 0},
        {testTS: 0, expected: 56},
        {testTS: -100, expected: 56},

    ])('Получить возраст из таймстампа $testTS -> $expected', ({testTS, expected}) => {
        vi.setSystemTime(new Date('2026-02-22'))
        expect(getAgeFromTS(testTS)).toBe(expected)
        vi.useRealTimers()
    })


    test.todo('getReadableFormatFromTS работает корректно')
})
