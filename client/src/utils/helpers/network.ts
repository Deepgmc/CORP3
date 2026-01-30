import { RESPONSE_STATUS_CODES } from "@/constants";
import type { AxiosResponse } from "axios";

export function isSuccessRequest(result: AxiosResponse){
    return result.status === RESPONSE_STATUS_CODES.CREATED || result.status === RESPONSE_STATUS_CODES.SUCCESS
}
