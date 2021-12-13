import { Button } from "@chakra-ui/button";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/menu";
import { Tabs, TabList, Tab } from "@chakra-ui/react";

import strings from "../misc/strings.json";

const EditorTopBar = ({ documentName, addObject, onSimulationModeChange }) => {
    return (
        <div className="w-full h-16 flex border-b-2 border-gray">
            <span className="align-middle my-auto ml-8 text-lg font-medium text-gray-500 mr-8">
                {documentName}
            </span>
            <div className="inline-block my-auto">
                <Menu>
                    <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        {strings.addObject}
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => addObject("computer")}>{strings.computer}</MenuItem>
                        <MenuItem onClick={() => addObject("router")}>{strings.router}</MenuItem>
                        <MenuItem onClick={() => addObject("switch")}>{strings.switch}</MenuItem>
                    </MenuList>
                </Menu>

                
            </div>

            <div className="inline-block my-auto ml-8">
                <Tabs variant="soft-rounded" colorScheme="blue" onChange={(index) => onSimulationModeChange(index === 1)}>
                    <TabList>
                        <Tab>{strings.editingMode}</Tab>
                        <Tab>{strings.simulationMode}</Tab>
                    </TabList>
                </Tabs>
            </div>
        </div>
    );
}

export default EditorTopBar;