import sendDataPacket from "./send_data_packet";

import errorDescriptions from "../../misc/error_descriptions.json";
import packetStatusDescriptions from "../../misc/packet_status_descriptions.json";

const wait = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds));

const sendDataPacketAndVisualizeRoute = async (canvasDataItems, setCanvasDataItems, runningComputerPrograms, sourceItemId, destinationIp, toast, isSimulationSlowMode) => {
    const displayError = (message) => {
        toast({
            description: message,
            status: "error",
            duration: isSimulationSlowMode ? 4000 : 1000,
            isClosable: false,
        });
    }

    const displayStatus = (message) => {
        toast({
            description: message,
            status: "info",
            duration: isSimulationSlowMode ? 4000 : 1000,
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
        }, isSimulationSlowMode ? 4000 : 1000);
    }

    const updateStatus = async (status) => {
        if (status.event === "error") {
            displayError(errorDescriptions[status.errorType]);
        } else {
            if (status.event === "usingCable") {
                highlightItem(status.cableId);
            } else if (status.event === "destinationReached") {
                highlightItem(status.destinationItemId);
            } else if (status.event === "gatewayRouterReached") {
                highlightItem(status.gatewayItemId);
            } else if (status.event === "switchReached") {
                highlightItem(status.switchItemId);
            } else if (status.event === "echoServerReached") {
                highlightItem(status.echoServerItemId);
            }

            displayStatus(packetStatusDescriptions[status.event]);
        }

        await wait(isSimulationSlowMode ? 4100 : 1100);
    }

    await sendDataPacket(canvasDataItems, runningComputerPrograms, sourceItemId, destinationIp, updateStatus, sourceItemId);
}

export default sendDataPacketAndVisualizeRoute;