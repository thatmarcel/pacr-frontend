import { Button } from "@chakra-ui/button";
import { EditIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useDrag } from "react-dnd";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,

    Input
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";

import strings from "../misc/strings.json";
import ComputerInteractionPane from "./ComputerInteractionPane";

const CanvasObject = ({ isSimulationMode, item, canvasDataItems, setCanvasDataItems, setSimulationRunning, isSimulationRunning, onRightClick }) => {
    const { isOpen: isConfigModalOpen, onOpen: onConfigModalOpen, onClose: onConfigModalClose } = useDisclosure();
    const { isOpen: isInteractionModalOpen, onOpen: onInteractionModalOpen, onClose: onInteractionModalClose } = useDisclosure();

    const id = item.id;
    const deviceType = item.deviceType;
    const ipAddress = item.ipAddress;
    const gateway = item.gateway;
    const left = item.x;
    const top = item.y;

    const routerData = item.deviceType === "router" && item.routerData;

    const isHighlighted = item.isHighlighted;

    const hasInteractionMenuOption = item.deviceType === "computer";

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "canvasObject",
        item: item,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [item]);

    if (isDragging) {
        return <div ref={drag}/>;
    }

    return (
        <div ref={!isSimulationMode ? drag : null} className={`w-72 rounded-xl shadow overflow-hidden select-none absolute transition-all duration-300 ${isHighlighted ? "border-yellow-400 border-4" : ""}`} style={{
            left: left,
            top: top
        }} id={`canvas-object-${deviceType}-${id}`} onContextMenuCapture={(event) => {
            event.preventDefault();
            onRightClick();
        }}>
            <div className="px-4 pt-4 pb-3 border-b-2 border-gray-200 bg-white flex">
                <img src={`/images/icons/${deviceType}-256.png`} className="w-6 inline mr-4 my-auto" style={{ marginTop: "-2px" }} />
                <span className="font-bold text-gray-800 my-auto">
                    {
                        deviceType === "switch"
                            ? strings.switch
                            : deviceType === "router" ? `${routerData.sides.a.ipAddress} (A), ${routerData.sides.b.ipAddress} (B)` : ipAddress
                    }
                </span>
            </div>

            <div className="bg-gray-100 overflow-hidden">
                <Button onClick={() => { isSimulationMode ? (deviceType === "computer" && onInteractionModalOpen()) : onConfigModalOpen()}} leftIcon={isSimulationMode ? (hasInteractionMenuOption ? <ExternalLinkIcon /> : null) : <EditIcon />} variant="ghost" isFullWidth={true} justifyContent="flex-start" borderRadius={0} isDisabled={(isSimulationMode && !hasInteractionMenuOption) || isSimulationRunning}>
                    <span className="mt-1">
                        {isSimulationMode ? (hasInteractionMenuOption ? strings.interactWithObject : strings.noInteractivity) : strings.editObject}
                    </span>
                </Button>
            </div>

            <Modal isOpen={isConfigModalOpen} onClose={onConfigModalOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {strings.editObjectTitle}
                    </ModalHeader>
                    <ModalBody>
                        {deviceType === "router"
                            ? <>
                                <p className="text-sm font-bold text-gray-700 ml-2">
                                    {strings.ipAddress} (A)
                                </p>
                                <Input placeholder="0.0.0.0" value={routerData.sides.a.ipAddress} onChange={(event) => {
                                    const newItems = [...canvasDataItems];
                                    const updatedItem = newItems.filter(it => it.id === item.id)[0];
                                    updatedItem.routerData.sides.a.ipAddress = event.target.value;
                    
                                    setCanvasDataItems(newItems);
                                }} marginTop={1} />

                                <p className="text-sm font-bold text-gray-700 ml-2 mt-6">
                                    {strings.subnetMask} (A)
                                </p>
                                <Input placeholder="0.0.0.0" value={routerData.sides.a.subnetMask} onChange={(event) => {
                                    const newItems = [...canvasDataItems];
                                    const updatedItem = newItems.filter(it => it.id === item.id)[0];
                                    updatedItem.routerData.sides.a.subnetMask = event.target.value;
                    
                                    setCanvasDataItems(newItems);
                                }} marginTop={1} />

                                <p className="text-sm font-bold text-gray-700 ml-2 mt-6">
                                    {strings.ipAddress} (B)
                                </p>
                                <Input placeholder="0.0.0.0" value={routerData.sides.b.ipAddress} onChange={(event) => {
                                    const newItems = [...canvasDataItems];
                                    const updatedItem = newItems.filter(it => it.id === item.id)[0];
                                    updatedItem.routerData.sides.b.ipAddress = event.target.value;
                    
                                    setCanvasDataItems(newItems);
                                }} marginTop={1} />

                                <p className="text-sm font-bold text-gray-700 ml-2 mt-6">
                                    {strings.subnetMask} (B)
                                </p>
                                <Input placeholder="0.0.0.0" value={routerData.sides.b.subnetMask} onChange={(event) => {
                                    const newItems = [...canvasDataItems];
                                    const updatedItem = newItems.filter(it => it.id === item.id)[0];
                                    updatedItem.routerData.sides.b.subnetMask = event.target.value;
                    
                                    setCanvasDataItems(newItems);
                                }} marginTop={1} />
                            </>
                            : item.deviceType === "switch"
                                ? null
                                : <>
                                    <p className="text-sm font-bold text-gray-700 ml-2">
                                        {strings.ipAddress}
                                    </p>
                                    <Input placeholder="0.0.0.0" value={ipAddress} onChange={(event) => {
                                        const newItems = [...canvasDataItems];
                                        const updatedItem = newItems.filter(it => it.id === item.id)[0];
                                        updatedItem.ipAddress = event.target.value;
                    
                                        setCanvasDataItems(newItems);
                                    }} marginTop={1} />
                        </>}

                        {["computer", "router"].includes(deviceType)
                            ? <div>
                                <p className="text-sm font-bold text-gray-700 ml-2 mt-6">
                                    {strings.gateway}
                                </p>
                                <Input placeholder="0.0.0.0" value={gateway} onChange={(event) => {
                                    const newItems = [...canvasDataItems];
                                    const updatedItem = newItems.filter(it => it.id === item.id)[0];
                                    updatedItem.gateway = event.target.value;
                    
                                    setCanvasDataItems(newItems);
                                }} marginTop={1} />
                            </div>
                            : null
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={() => {
                            onConfigModalClose();

                            const newItems = [...canvasDataItems].filter(it => it.id !== item.id);
                            
                            setTimeout(() => {
                                setCanvasDataItems(newItems);
                            }, 400);
                        }} colorScheme="red">
                            {strings.delete}
                        </Button>
                        <Button variant="ghost" onClick={onConfigModalClose}>
                            {strings.close}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isInteractionModalOpen} onClose={onInteractionModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {strings.interactWithObjectTitle}
                    </ModalHeader>
                    <ModalBody>
                        <ComputerInteractionPane
                            canvasDataItems={canvasDataItems}
                            setCanvasDataItems={setCanvasDataItems}
                            computerItemId={id}
                            onModalClose={onInteractionModalClose}
                            onModalOpen={onInteractionModalOpen}
                            setSimulationRunning={setSimulationRunning}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onInteractionModalClose}>
                            {strings.close}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default CanvasObject;