import { useState } from "react";
import DefaultContainer from "../components/DefaultContainer";
import EditorTopBar from "../components/EditorTopBar";

import dynamic from 'next/dynamic'

const MainCanvas = dynamic(() => import("../components/MainCanvas"), {
    ssr: false
})

import randomstring from "randomstring";
import Script from "next/script";

const EditorPage = () => {
    const [canvasDataItems, setCanvasDataItems] = useState([
        {
            deviceType: "computer",
            ipAddress: "0.0.0.0",
            id: "aaa",
            x: 100,
            y: 100
        },
        {
            deviceType: "switch",
            ipAddress: "0.0.0.0",
            id: "bbb",
            x: 300,
            y: 500
        },
        {
            deviceType: "cable",
            ipAddress: "0.0.0.0",
            id: "ccc",
            cableData: {
                connections: [
                    {
                        id: "aaa",
                        deviceType: "computer"
                    },
                    {
                        id: "bbb",
                        deviceType: "switch"
                    }
                ]
            }
        }
    ]);
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
            <Script src="https://cdn.jsdelivr.net/npm/leader-line/leader-line.min.js" strategy="beforeInteractive" />
            <EditorTopBar documentName="Beispieldokument 1" addObject={addObject} onSimulationModeChange={(isSimMode) => setSimulationMode(isSimMode)} />
            <MainCanvas canvasDataItems={canvasDataItems} setCanvasDataItems={setCanvasDataItems} isSimulationMode={isSimulationMode} />
        </DefaultContainer>
    );
}

export default EditorPage;