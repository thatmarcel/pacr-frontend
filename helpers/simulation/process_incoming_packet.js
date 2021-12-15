import sendDataPacket from "./send_data_packet";

const processIncomingPacket = async (allItems, runningComputerPrograms, sourceItemId, destinationItem, updateStatus) => {
    const isRunningEchoServer = runningComputerPrograms.filter(it => it.computerItemId === destinationItem.id && it.programType === "echoServer").length > 0;

    if (isRunningEchoServer) {
        const echoDestinationItem = allItems.filter(item => item.id === sourceItemId)[0];

        updateStatus && (await updateStatus({
            event: "echoServerReached",
            echoServerItemId: destinationItem.id
        }));

        await sendDataPacket(allItems, runningComputerPrograms, destinationItem.id, echoDestinationItem.ipAddress, updateStatus);
    }

    return !isRunningEchoServer;
}

export default processIncomingPacket;