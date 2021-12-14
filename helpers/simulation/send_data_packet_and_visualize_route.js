import sendDataPacket from "./send_data_packet";

import errorDescriptions from "../../misc/error_descriptions.json";
import packetStatusDescriptions from "../../misc/packet_status_descriptions.json";

const wait = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const sendDataPacketAndVisualizeRoute = (allItems, sourceItemId, destinationIp, toast) => {
    const displayError = (message) => {
        toast({
            description: message,
            status: "error",
            duration: 5000,
            isClosable: false,
        });
    }

    const displayStatus = (message) => {
        toast({
            description: message,
            status: "info",
            duration: 5000,
            isClosable: false,
        });
    }

    const updateStatus = async (status) => {
        if (status.event === "error") {
            displayError(errorDescriptions[status.errorType]);
        } else {
            displayStatus(packetStatusDescriptions[status.event]);
        }

        await wait(5.1);
    }

    sendDataPacket(allItems, sourceItemId, destinationIp, updateStatus);
}

export default sendDataPacketAndVisualizeRoute;