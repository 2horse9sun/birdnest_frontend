import {get} from "../utils/Requester";
import APIConfig from "../configs/APIConfig";

const violationAPIPrefix = APIConfig.violationAPIPrefix;


// APIs related to violation

export async function getViolationInfos(user_id) {
    let res = await get(violationAPIPrefix + '/getViolationInfos')();
    return res;
}
