import { useState } from "react";
import DefaultContainer from "../components/DefaultContainer";
import EditorTopBar from "../components/EditorTopBar";
import MainCanvas from "../components/MainCanvas";

import randomstring from "randomstring";

const EditorPage = () => {
    const [canvasDataItems, setCanvasDataItems] = useState([]);
    const [isSimulationMode, setSimulationMode] = useState(false);

    const addObject = (deviceType) => {
        const newItems = [...canvasDataItems];

        newItems.push({
            deviceType: deviceType,
            ipAddress: "0.0.0.0",
            id: randomstring.generate(12),
            x: 100,
            y: 100
        });

        setCanvasDataItems(newItems);
    }

    return (
        <DefaultContainer hideBarBottomShadow={true} noScroll={true}>
            <EditorTopBar documentName="Beispieldokument 1" addObject={addObject} onSimulationModeChange={(isSimMode) => setSimulationMode(isSimMode)} />
            <MainCanvas canvasDataItems={canvasDataItems} setCanvasDataItems={setCanvasDataItems} isSimulationMode={isSimulationMode} />
        </DefaultContainer>
    );
}

export default EditorPage;