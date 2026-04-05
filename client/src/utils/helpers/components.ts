import type { IPositionSelect } from "@/interfaces/User";

interface DataMapping<T> {
  idField   : keyof T;
  labelField: keyof T;
}

//из массивов данных формируем массив опций для селектов
export function getSelectOptionsFromDataArray<T> (data: T[], mapping: DataMapping<T>): IPositionSelect[] {
    return data.map((value: T) => {
        return {
            value: value[mapping.idField] as number,
            label: value[mapping.labelField] as string,
        }
    })
}
