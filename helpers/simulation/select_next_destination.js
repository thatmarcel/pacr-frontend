const selectNextDestination = (allItems, sourceItemId, destinationIp) => {
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

        const isDestination = destinationItem &&
            (
                destinationItem.type === "router" && (
                    destinationItem.routerData.sides.a.ipAddress === destinationIp ||
                    destinationItem.routerData.sides.b.ipAddress === destinationIp
                ) || destinationItem.ipAddress === destinationIp
            );

        if (isDestination) {
            return true;
        } else if (destinationItem.deviceType === "switch") {
            console.log("checking switch");
            const r = selectNextDestination(allItems, destinationItem.id, destinationIp).success;
            console.log("checked switch");
            console.log(r);
            return r;
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