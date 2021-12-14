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
    const [canvasDataItems, setCanvasDataItems] = useState([]);
    const [isSimulationMode, setSimulationMode] = useState(false);

    const addObject = (deviceType) => {
        const newItems = [...canvasDataItems];

        let item = {
            deviceType: deviceType,
            id: randomstring.generate(12),
            x: 100,
            y: 100
        };

        if (deviceType === "router") {
            item.routerData = {
                sides: {
                    a: {
                        ipAddress: "0.0.0.0",
                        subnetMask: "255.255.255.0"
                    },
                    b: {
                        ipAddress: "0.0.0.0",
                        subnetMask: "255.255.255.0"
                    }
                }
            }
        } else {
            item.ipAddress = "0.0.0.0";
        }

        newItems.push(item);

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