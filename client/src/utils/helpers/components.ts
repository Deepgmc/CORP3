import type { ISelectData } from "@/interfaces/User";

interface DataMapping<T> {
  idField   : keyof T;
  labelField: keyof T;
}

//из массивов данных формируем массив опций для селектов
export function getSelectOptionsFromDataArray<T> (data: T[], mapping: DataMapping<T>): ISelectData[] {
    return data.map((value: T) => {
        return {
            value: value[mapping.idField] as number,
            label: value[mapping.labelField] as string,
        }
    })
}
