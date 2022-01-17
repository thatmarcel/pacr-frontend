import { matches } from "ip-matching";

const checkIfIpMatchesMask = (ipAddress, maskIpAddress, mask) => {
    return matches(ipAddress, `${maskIpAddress}/${mask}`);
}

export default checkIfIpMatchesMask;