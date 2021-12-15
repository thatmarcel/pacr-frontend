import checkIfIpMatchesMask from "./check_if_ip_matches_mask";

const selectNextDestination = (allItems, sourceItemId, destinationIp, prevSwitchItemId, prevGateway) => {
    const sourceItem = allItems.filter(item => item.id === sourceItemId)[0];

    if (!sourceItem) {
        return {
            success: false,
            errorType: "internalError"
        }
    }

    const sourceItemGateway = sourceItem.deviceType === "switch" ? prevGateway : sourceItem.gateway;

    const eligibleRoutes = allItems.filter(item => {
        if (item.deviceType !== "cable") { return false; }

        let cableDestinationInfo;
        let cableSourceInfo;

        if (item.cableData.connections[0].id === sourceItemId) {
            cableDestinationInfo = item.cableData.connections[1];
            cableSourceInfo = item.cableData.connections[0];
        } else if (item.cableData.connections[1].id === sourceItemId) {
            cableDestinationInfo = item.cableData.connections[0];
            cableSourceInfo = item.cableData.connections[1];
        } else {
            return false;
        }

        const destinationItem = allItems.filter(it => it.id === cableDestinationInfo.id)[0];

        if (!destinationItem || destinationItem.id === prevSwitchItemId) {
            return false;
        }

        const routerDestinationIp = destinationItem.routerData && (cableDestinationInfo.routerSide === "a" ? destinationItem.routerData.sides.a.ipAddress : destinationItem.routerData.sides.b.ipAddress);
        const isMatchingRouter = routerDestinationIp === destinationIp;

        const isDestination = isMatchingRouter || destinationItem.ipAddress === destinationIp;

        if (sourceItem.deviceType === "router") {
            const routerSourceIp = sourceItem.routerData && (cableSourceInfo.routerSide === "a" ? sourceItem.routerData.sides.a.ipAddress : sourceItem.routerData.sides.b.ipAddress);
            const routerSourceMask = sourceItem.routerData && (cableSourceInfo.routerSide === "a" ? sourceItem.routerData.sides.a.subnetMask : sourceItem.routerData.sides.b.subnetMask);
            
            const isCorrectSubnet = checkIfIpMatchesMask(destinationIp, routerSourceIp, routerSourceMask);

            if (!isCorrectSubnet) {
                return;
            }

            const routingTable = sourceItem.routerData.table || [];
            
            const matchingRouterDestinations = routingTable.filter(entry => {
                if (entry.gateway !== "127.0.0.1" && entry.gateway !== routerSourceIp) {
                    // TODO: Implement sending to another gateway
                    return false;
                }

                return (
                    entry.destination === destinationIp &&
                    entry.interface === routerSourceIp &&
                    checkIfIpMatchesMask(destinationIp, entry.destination, entry.subnetMask)
                )
            });

            return matchingRouterDestinations.length > 0;
        }

        if (isDestination) {
            return true;
        } else if (destinationItem.deviceType === "switch") {
            return selectNextDestination(allItems, destinationItem.id, destinationIp, sourceItemId, sourceItemGateway).success;
        }
    }).map(item => {
        const destinationItemId = item.cableData.connections[0].id === sourceItemId ? item.cableData.connections[1].id : item.cableData.connections[0].id
        const destinationItem = allItems.filter(it => it.id === destinationItemId)[0];

        return {
            success: true,
            cableId: item.id,
            destinationItem: destinationItem,
            hasReachedFinalDestination: destinationItem.ipAddress === destinationIp
        }
    }).sort((a, b) => b.destinationItem.deviceType !== "switch" - a.destinationItem.deviceType !== "switch");

    if (eligibleRoutes.length < 1 && sourceItemGateway !== destinationIp) {
        if (sourceItem.deviceType === "router") {
            return {
                success: false,
                errorType: "noRouteFromGatewayRouter"
            }
        }

        if (!sourceItemGateway) {
            return {
                success: false,
                errorType: "noRouteToDestinationAndNoGatewaySet"
            }
        }

        let resultToGateway = selectNextDestination(allItems, sourceItemId, sourceItemGateway, undefined, sourceItemGateway);
        resultToGateway.hasReachedFinalDestination = false;
        return resultToGateway;
    }

    if (eligibleRoutes.length < 1 && sourceItemGateway === destinationIp) {
        return {
            success: false,
            errorType: "noRouteToGateway"
        }
    }

    eligibleRoutes[0].prevGateway = sourceItemGateway;

    return eligibleRoutes[0];
}

export default selectNextDestination;