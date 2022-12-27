// APIs related to violation
import {get} from "../utils/Requester";
import APIConfig from "../configs/APIConfig";

const violationAPIPrefix = APIConfig.violationAPIPrefix;


export async function getViolationInfos(user_id) {
    let res = await get(violationAPIPrefix + '/getViolationInfos')();
    return res;
}
