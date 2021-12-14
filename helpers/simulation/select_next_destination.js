const selectNextDestination = (allItems, sourceItemId, destinationIp, prevSwitchItemId) => {
    const sourceItem = allItems.filter(item => item.id === sourceItemId)[0];

    if (!sourceItem) {
        return {
            success: false,
            errorType: "internalError"
        }
    }

    const eligibleRoutes = allItems.filter(item => {
        if (item.deviceType !== "cable") { return false; }

        let cableDestinationItemId;

        if (item.cableData.connections[0].id === sourceItemId) {
            cableDestinationItemId = item.cableData.connections[1].id;
        } else if (item.cableData.connections[1].id === sourceItemId) {
            cableDestinationItemId = item.cableData.connections[0].id;
        } else {
            return false;
        }

        const destinationItem = allItems.filter(it => it.id === cableDestinationItemId)[0];

        if (!destinationItem || destinationItem.id === prevSwitchItemId) {
            return false;
        }

        const isMatchingRouter = destinationItem.routerData && (destinationItem.routerData.sides.a.ipAddress === destinationIp ||
            destinationItem.routerData.sides.b.ipAddress === destinationIp);

        const isDestination = isMatchingRouter || destinationItem.ipAddress === destinationIp;

        if (isDestination) {
            return true;
        } else if (destinationItem.deviceType === "switch") {
            return selectNextDestination(allItems, destinationItem.id, destinationIp, sourceItemId).success;
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

    if (eligibleRoutes.length < 1 && sourceItem.gateway !== destinationIp) {
        if (!sourceItem.gateway) {
            return {
                success: false,
                errorType: "noRouteToDestinationAndNoGatewaySet"
            }
        }

        let resultToGateway = selectNextDestination(allItems, sourceItemId, sourceItem.gateway);
        resultToGateway.hasReachedFinalDestination = false;
        return resultToGateway;
    }

    if (eligibleRoutes.length < 1 && sourceItem.gateway === destinationIp) {
        return {
            success: false,
            errorType: "noRouteToGateway"
        }
    }

    return eligibleRoutes[0];
}

export default selectNextDestination;