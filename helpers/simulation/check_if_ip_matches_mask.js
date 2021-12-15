const checkIfIpMatchesMask = (ipAddress, maskIpAddress, mask) => {
    const ipParts = ipAddress.split(".").map(part => parseInt(part)).filter(part => part !== NaN);
    const maskIpParts = maskIpAddress.split(".").map(part => parseInt(part)).filter(part => part !== NaN);
    const maskParts = mask.split(".").map(part => parseInt(part)).filter(part => part !== NaN);

    /* console.log("=========== checking if ip matches mask ===============");
    console.log("ip parts: " + ipParts);
    console.log("mask ip parts: " + maskIpParts);
    console.log("mask parts: " + maskParts); */

    if (ipParts.length !== 4 || maskIpParts.length !== 4 || maskParts.length !== 4) {
        return false;
    }

    for (let index of [0, 1, 2, 3]) {
        if (maskParts[index] === 0) {
            continue;
        }

        if (maskParts[index] < 0 || maskParts[index] > 255) {
            return false;
        }

        if (maskParts[index] === 255 && ipParts[index] !== maskIpParts[index]) {
            return false;
        }

        // TODO: Check masks with numbers different than 0 and 255
    }

    return true;
}

export default checkIfIpMatchesMask;