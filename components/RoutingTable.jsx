import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,

    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,

    Input,

    Button,

    IconButton
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/hooks";

import { useState } from "react";

import randomstring from "randomstring";

import strings from "../misc/strings.json";

const RoutingTable = ({ marginTop, item, canvasDataItems, setCanvasDataItems }) => {
    const { isOpen: isAddEntryModalOpen, onOpen: onAddEntryModalOpen, onClose: onAddEntryModalClose } = useDisclosure();

    const [newEntryDestination, setNewEntryDestination] = useState("");
    const [newEntrySubnetMask, setNewEntrySubnetMask] = useState("");
    const [newEntryGateway, setNewEntryGateway] = useState("");
    const [newEntryInterface, setNewEntryInterface] = useState("");

    const routingTable = item.routerData.table || [];

    return (
        <div className={`mt-${marginTop}`}>
            <span className="text-md text-gray-700 font-bold ml-2">
                {strings.routingTable}
            </span>

            <Table variant="simple" marginTop={2}>
                <Thead>
                    <Tr>
                        <Th>{strings.destination}</Th>
                        <Th>{strings.subnetMask}</Th>
                        <Th>{strings.gateway}</Th>
                        <Th>{strings.interface}</Th>
                        <Th />
                    </Tr>
                </Thead>
                <Tbody>
                    {routingTable.map(entry => (
                        <Tr>
                            <Td>{entry.destination}</Td>
                            <Td>{entry.subnetMask}</Td>
                            <Td>{entry.gateway}</Td>
                            <Td>{entry.interface}</Td>
                            <Td w={1}>
                                <IconButton aria-label="Delete entry" icon={<DeleteIcon />} variant="ghost" onClick={() => {
                                    const newItems = [...canvasDataItems];

                                    const updatedItem = newItems.filter(it => it.id === item.id)[0]
                                    updatedItem.routerData.table = updatedItem.routerData.table.filter(en => en.id !== entry.id);
        
                                    setCanvasDataItems(newItems);
                                }} />
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Button marginTop={6} variant="ghost" onClick={async () => {
                onAddEntryModalOpen();
            }}>
                {strings.addEntry}
            </Button>

            <Modal isOpen={isAddEntryModalOpen} onClose={onAddEntryModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {strings.addEntry}
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-sm font-bold text-gray-700 ml-2">
                            {strings.destination}
                        </p>
                        <Input placeholder="0.0.0.0" value={newEntryDestination} onChange={(event) => {
                            setNewEntryDestination(event.target.value);
                        }} marginTop={1} />

                        <p className="text-sm font-bold text-gray-700 ml-2 mt-6">
                            {strings.subnetMask}
                        </p>
                        <Input placeholder="0.0.0.0" value={newEntrySubnetMask} onChange={(event) => {
                            setNewEntrySubnetMask(event.target.value);
                        }} marginTop={1} />

                        <p className="text-sm font-bold text-gray-700 ml-2 mt-6">
                            {strings.gateway}
                        </p>
                        <Input placeholder="0.0.0.0" value={newEntryGateway} onChange={(event) => {
                            setNewEntryGateway(event.target.value);
                        }} marginTop={1} />

                        <p className="text-sm font-bold text-gray-700 ml-2 mt-6">
                            {strings.interface}
                        </p>
                        <Input placeholder="0.0.0.0" value={newEntryInterface} onChange={(event) => {
                            setNewEntryInterface(event.target.value);
                        }} marginTop={1} />
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onAddEntryModalClose}>
                            {strings.close}
                        </Button>

                        <Button variant="ghost" isDisabled={
                            !newEntryDestination ||
                            !newEntrySubnetMask ||
                            !newEntryGateway ||
                            !newEntryInterface
                        } onClick={() => {
                            const newItems = [...canvasDataItems];

                            const updatedItem = newItems.filter(it => it.id === item.id)[0];
                            updatedItem.routerData.table = updatedItem.routerData.table || [];
                            updatedItem.routerData.table.push({
                                destination: newEntryDestination,
                                subnetMask: newEntrySubnetMask,
                                gateway: newEntryGateway,
                                interface: newEntryInterface,
                                id: randomstring.generate(12)
                            });

                            setCanvasDataItems(newItems);

                            onAddEntryModalClose();
                        }}>
                            {strings.add}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default RoutingTable;