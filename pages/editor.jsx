import { useEffect, useState } from "react";
import DefaultContainer from "../components/DefaultContainer";
import EditorTopBar from "../components/EditorTopBar";

import dynamic from 'next/dynamic'

const MainCanvas = dynamic(() => import("../components/MainCanvas"), {
    ssr: false
})

import randomstring from "randomstring";
import Script from "next/script";

import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";

import urls from "../misc/urls.json";

const EditorPage = () => {
    const [canvasDataItems, setCanvasDataItems] = useState([]);
    const [runningComputerPrograms, setRunningComputerPrograms] = useState([]);
    const [isSimulationMode, setSimulationMode] = useState(false);
    const [isSimulationRunning, setSimulationRunning] = useState(false);
    const [saveState, setSaveState] = useState("unsaved");

    const router = useRouter();
    const docId = router.query.id;

    useEffect(async () => {
        if (canvasDataItems.length < 1 && docId && saveState === "unsaved") {
            try {
                const fetchResponse = await fetch(`${urls.backendBaseURL}/doc/fetch?id=${docId}`);
                const content = await fetchResponse.text();

                content && setCanvasDataItems(JSON.parse(content) || []);
            } catch {}
        } else {
            let newDocId = docId || randomstring.generate(6);

            await fetch(`${urls.backendBaseURL}/doc/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: newDocId,
                    content: JSON.stringify(
                        canvasDataItems.map(item => {
                            item.isHighlighted = false;

                            return item;
                        })
                    )
                })
            });

            setSaveState("saved");

            router.push(`/editor?id=${newDocId}`);
        }
    }, [docId, canvasDataItems])

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
        } else if (deviceType !== "switch") {
            item.ipAddress = "0.0.0.0";
        }

        newItems.push(item);

        setCanvasDataItems(newItems);
    }

    return (
        <DefaultContainer hideBarBottomShadow={true} noScroll={true}>
            <Script src="https://cdn.jsdelivr.net/npm/leader-line/leader-line.min.js" strategy="beforeInteractive" />
            <EditorTopBar
                addObject={addObject}
                isSimulationMode={isSimulationMode}
                onSimulationModeChange={(isSimMode) => setSimulationMode(isSimMode)}
                isSimulationRunning={isSimulationRunning}
                saveState={saveState}
            />
            <MainCanvas
                canvasDataItems={canvasDataItems}
                setCanvasDataItems={setCanvasDataItems}
                isSimulationMode={isSimulationMode}
                setSimulationRunning={setSimulationRunning}
                isSimulationRunning={isSimulationRunning}
                runningComputerPrograms={runningComputerPrograms}
                setRunningComputerPrograms={setRunningComputerPrograms}
            />
        </DefaultContainer>
    );
}

export default EditorPage;