import { RESPONSE_STATUS_CODES } from "@/utils/constants";
import type { AxiosResponse } from "axios";

export function isSuccessRequest(result: AxiosResponse){
    return result.status === RESPONSE_STATUS_CODES.CREATED || result.status === RESPONSE_STATUS_CODES.SUCCESS
}

export function isAffected(result: AxiosResponse) {
    return {
        one() {
            return result.data && parseInt(result.data.affected) === 1
        },
        many() {
            return result.data && parseInt(result.data.affected) > 1
        }
    }
}
