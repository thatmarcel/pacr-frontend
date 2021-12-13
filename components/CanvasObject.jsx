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

const CanvasObject = ({ isSimulationMode, item, canvasDataItems, setCanvasDataItems }) => {
    const { isOpen: isConfigModalOpen, onOpen: onConfigModalOpen, onClose: onConfigModalClose } = useDisclosure();

    const id = item.id;
    const deviceType = item.deviceType;
    const ipAddress = item.ipAddress;
    const gateway = item.gateway;
    const left = item.x;
    const top = item.y;

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
        <div ref={drag} className="w-72 rounded-xl shadow overflow-hidden select-none active:cursor-move absolute" style={{
            left: left,
            top: top
        }} id={`canvas-object-${deviceType}-${id}`}>
            <div className="px-4 pt-4 pb-3 border-b-2 border-gray-200 bg-white flex">
                <img src={`/images/icons/${deviceType}-256.png`} className="w-6 inline mr-4 my-auto" style={{ marginTop: "-2px" }} />
                <span className="font-bold text-gray-800 my-auto">
                    {ipAddress}
                </span>
            </div>

            <div className="bg-gray-100 overflow-hidden">
                <Button onClick={() => !isSimulationMode && onConfigModalOpen()} leftIcon={isSimulationMode ? <ExternalLinkIcon /> : <EditIcon />} variant="ghost" isFullWidth={true} justifyContent="flex-start" borderRadius={0}>
                    <span className="mt-1">{isSimulationMode ? strings.interactWithObject : strings.editObject}</span>
                </Button>
            </div>

            <Modal isOpen={isConfigModalOpen} onClose={onConfigModalOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {strings.editObjectTitle}
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-sm font-bold text-gray-700 ml-2">
                            {strings.ipAddress}
                        </p>
                        <Input placeholder="0.0.0.0" value={ipAddress} onChange={(event) => {
                            const newItems = [...canvasDataItems];
                            const updatedItem = newItems.filter(it => it.id === item.id)[0];
                            updatedItem.ipAddress = event.target.value;
                    
                            setCanvasDataItems(newItems);
                        }} marginTop={1} />

                        {deviceType === "computer"
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
        </div>
    );
}

export default CanvasObject;