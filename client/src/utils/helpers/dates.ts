const months = ['01','02','03','04','05','06','07','08','09','10','11','12']
export function convertTSToStr(timestamp: number | string) : boolean | string {
  //приводим таймстамп к формату 25.05.2026
  timestamp = Number(timestamp)
  if(!Number.isInteger(timestamp)) return false

  const date = new Date(timestamp)
  return `${ date.getDate() }.${ months[date.getMonth()] }.${ date.getFullYear() }`
}
