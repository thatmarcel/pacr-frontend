import selectNextDestination from "./select_next_destination";

const sendDataPacket = async (allItems, sourceItemId, destinationIp, updateStatus) => {
    const sourceItem = allItems.filter(item => item.id === sourceItemId)[0];

    if (!sourceItem) {
        updateStatus && (await updateStatus({
            event: "error",
            errorType: "internalError"
        }));

        return;
    }
    
    let packetLocationId = sourceItemId;

    while (true) {
        const result = selectNextDestination(allItems, packetLocationId, destinationIp);

        if (!result.success) {
            updateStatus && (await updateStatus({
                event: "error",
                errorType: result.errorType
            }));

            return;
        }

        updateStatus && (await updateStatus({
            event: "usingCable",
            cableId: result.cableId
        }));

        if (result.hasReachedFinalDestination) {
            updateStatus && (await updateStatus({
                event: "destinationReached",
                destinationItemId: result.destinationItem.id
            }));

            return;
        } else {
            if (result.destinationItem.deviceType === "router") {
                updateStatus && (await updateStatus({
                    event: "gatewayRouterReached",
                    gatewayItemId: result.destinationItem.id
                }));

                await sendDataPacket(allItems, result.destinationItem.id, destinationIp, updateStatus);

                /* updateStatus && (await updateStatus({
                    event: "error",
                    errorType: "routersNotImplemented"
                })); */

                return;
            } else if (result.destinationItem.deviceType === "switch") {
                updateStatus && (await updateStatus({
                    event: "switchReached",
                    switchItemId: result.destinationItem.id
                }));

                packetLocationId = result.destinationItem.id;
            } else {
                updateStatus && (await updateStatus({
                    event: "error",
                    errorType: "gatewayReachedButNotTypeRouter"
                }));

                return;
            }
        }
    }
}

export default sendDataPacket;