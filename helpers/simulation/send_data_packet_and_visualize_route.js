import sendDataPacket from "./send_data_packet";

import errorDescriptions from "../../misc/error_descriptions.json";
import packetStatusDescriptions from "../../misc/packet_status_descriptions.json";

const wait = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds));

const sendDataPacketAndVisualizeRoute = (canvasDataItems, setCanvasDataItems, sourceItemId, destinationIp, toast) => {
    const displayError = (message) => {
        toast({
            description: message,
            status: "error",
            duration: 4000,
            isClosable: false,
        });
    }

    const displayStatus = (message) => {
        toast({
            description: message,
            status: "info",
            duration: 4000,
            isClosable: false,
        });
    }

    const highlightItem = (itemId) => {
        const newItems = [...canvasDataItems];
        newItems.filter(item => item.id === itemId)[0].isHighlighted = true;
        setCanvasDataItems(newItems);

        setTimeout(() => {
            const newerItems = [...newItems];
            newerItems.filter(item => item.id === itemId)[0].isHighlighted = false;
            setCanvasDataItems(newerItems);
        }, 4000);
    }

    const updateStatus = async (status) => {
        if (status.event === "error") {
            displayError(errorDescriptions[status.errorType]);
        } else {
            if (status.event === "usingCable") {
                highlightItem(status.cableId);
            } else if (status.event === "destinationReached") {
                highlightItem(status.destinationItemId);
            } else if (status.event === "gatewayReached") {
                highlightItem(status.gatewayItemId);
            }

            displayStatus(packetStatusDescriptions[status.event]);
        }

        await wait(4100);
    }

    sendDataPacket(canvasDataItems, sourceItemId, destinationIp, updateStatus);
}

export default sendDataPacketAndVisualizeRoute;