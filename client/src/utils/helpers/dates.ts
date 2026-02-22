import type { TResult } from "@/interfaces/Error"

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

export function convertTSToStr(timestamp: number | string): boolean | string {
    const convertedTimestamp = getCorrectTimestamp(timestamp)
    if(convertedTimestamp === false) return false
    //приводим таймстамп к формату 25.05.2026
    const date = new Date(convertedTimestamp)
    const day = date.getDate()
    return `${day < 10 ? `0${day}` : day}.${months[date.getMonth()]}.${date.getFullYear()}`
}

export function convertStrToUnixTimestamp(dateIncome: string): TResult {

    const unifiedStr = dateIncome.replaceAll('/', '.').replaceAll('-', '.')

    let parsedDate = Date.parse(unifiedStr)
    if(Number.isNaN(parsedDate)){
        const testUSDateArr: string[] = unifiedStr.split('.')
        if(testUSDateArr.length === 3){
            parsedDate = Date.parse(`${testUSDateArr[1]}.${testUSDateArr[0]}.${testUSDateArr[2]}`)
        }
    }

    if(Number.isNaN(parsedDate)){
        return {
            error: true,
            errorMessage: 'Неверный формат даты',
        }
    }

    return {
        error: false,
        res: parsedDate / 1000
    }
}

export function getAgeFromTS(timestamp: number): number | false {
    const convertedTimestamp = getCorrectTimestamp(timestamp)
    if(convertedTimestamp === false) return false
    const birthDate = new Date(convertedTimestamp)
    const nowDate = new Date()
    return Math.floor( (+nowDate - +birthDate) / (1000 * 60 * 60 * 24 * 365) )
}

function getCorrectTimestamp(timestamp: string | number): number | false {
    timestamp = Number(timestamp)
    if (!Number.isInteger(timestamp)) return false
    return timestamp
}
