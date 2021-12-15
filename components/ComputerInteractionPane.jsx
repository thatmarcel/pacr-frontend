import { Tabs, TabList, Tab, TabPanels, TabPanel, Input, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import sendDataPacketAndVisualizeRoute from "../helpers/simulation/send_data_packet_and_visualize_route";

import strings from "../misc/strings.json";

const ComputerInteractionPane = ({ canvasDataItems, setCanvasDataItems, computerItemId, onModalClose, onModalOpen, setSimulationRunning, runningComputerPrograms, setRunningComputerPrograms }) => {
    const [simpleClientDestinationIpAddress, setSimpleClientDestinationIpAddress] = useState(null);
    const [simpleClientMessageToSend, setSimpleClientMessageToSend] = useState(strings.simpleClientMessagePrefill);

    const toast = useToast();

    return (
        <div>
            <Tabs>
                <TabList>
                    <Tab>{strings.simpleClient}</Tab>
                    <Tab>{strings.echoServer}</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <p className="text-sm font-bold text-gray-700 ml-2 mt-2">
                            {strings.receiverIpAddress}
                        </p>
                        <Input placeholder="0.0.0.0" value={simpleClientDestinationIpAddress} onChange={(event) => {
                            setSimpleClientDestinationIpAddress(event.target.value);
                        }} marginTop={1} />

                        <p className="text-sm font-bold text-gray-700 ml-2 mt-6">
                            {strings.message}
                        </p>
                        <Input placeholder={strings.simpleClientMessagePlaceholder} value={simpleClientMessageToSend} onChange={(event) => {
                            setSimpleClientMessageToSend(event.target.value);
                        }} marginTop={1} />

                        <Button marginTop={6} paddingX={8} isDisabled={!simpleClientDestinationIpAddress || !simpleClientMessageToSend} onClick={async () => {
                            onModalClose();
                            setSimulationRunning(true);
                            await sendDataPacketAndVisualizeRoute(canvasDataItems, setCanvasDataItems, runningComputerPrograms, computerItemId, simpleClientDestinationIpAddress, toast);
                            setSimulationRunning(false);
                            onModalOpen();
                        }}>
                            {strings.send}
                        </Button>
                    </TabPanel>
                    <TabPanel>
                        <Button marginTop={6} paddingX={8} onClick={async () => {
                            const isRunning = runningComputerPrograms.filter(it => it.computerItemId === computerItemId && it.programType === "echoServer").length > 0;

                            let newRunningComputerPrograms = [...runningComputerPrograms];

                            if (!isRunning) {
                                newRunningComputerPrograms.push({
                                    computerItemId: computerItemId,
                                    programType: "echoServer"
                                })
                            } else {
                                newRunningComputerPrograms = newRunningComputerPrograms.filter(it => it.computerItemId !== computerItemId);
                            }

                            setRunningComputerPrograms(newRunningComputerPrograms);
                        }}>
                            {runningComputerPrograms.filter(it => it.computerItemId === computerItemId && it.programType === "echoServer").length > 0
                                ? strings.stop
                                : strings.start
                            }
                        </Button>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    )
}

export default ComputerInteractionPane;