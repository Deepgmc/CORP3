import { describe, expect, test, vi } from 'vitest'
import { convertTSToStr, convertStrToUnixTimestamp } from '@/utils/helpers/dates'
import type { TError } from '@/interfaces/Error'

describe('Dates.ts tests', () => {

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

    ])('Converts string to timestamp $testDate -> $expected', ({testDate, expected}) => {

        expect(convertStrToUnixTimestamp(testDate)).toEqual(expected)

    })

    test('convertTSToStr, converting timestamp to string', () => {
        vi.setSystemTime(new Date('1990-01-01'))
        const ts = Date.now()

        const convertedDate = convertTSToStr(ts)
        const wrongConvertedDate = convertTSToStr('25.25.1990')

        expect(convertedDate).toBe('01.01.1990')
        expect(wrongConvertedDate).toBe(false)

        vi.useRealTimers()
    })
})
