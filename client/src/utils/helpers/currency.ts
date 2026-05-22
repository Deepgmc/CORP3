export function calculateTax(amount: number, rate: number): number {
    return Math.round(amount * rate / 100)
}

// Форматирование числа в валюту
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
