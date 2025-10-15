export const emptyRule = (val: string) => val && val.length > 0 || 'Не может быть пустым'
export const tooShortRule = (val: string) => val && val.length >= 3 || `Слишком коротко`
export const tooLongRule = (val: string) => val && val.length < 30 || `Слишком длинно`
