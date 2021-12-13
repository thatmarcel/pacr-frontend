import CanvasObject from "./CanvasObject";
import { useDrop } from "react-dnd";
import { useEffect, useState } from "react";

import randomstring from "randomstring";

import strings from "../misc/strings.json";

const MainCanvas = ({ isSimulationMode, canvasDataItems, setCanvasDataItems }) => {
    const [, drop] = useDrop(() => ({
        accept: "canvasObject",
        drop(item, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();

            const x = Math.round(item.x + delta.x);
            const y = Math.round(item.y + delta.y);

            const newItems = [...canvasDataItems];
            const updatedItem = newItems.filter(it => it.id === item.id)[0];
            updatedItem.x = x;
            updatedItem.y = y;

            setCanvasDataItems(newItems);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            isOverCurrent: monitor.isOver({ shallow: true })
        })
    }), [canvasDataItems, setCanvasDataItems]);

    const [leaderLines, setLeaderLines] = useState([]);

    useEffect(async () => {
        setTimeout(() => {
            if (!window.LeaderLine) { return; }

            leaderLines.forEach(line => line.remove());

            setLeaderLines(canvasDataItems.filter(item => item.deviceType === "cable").map(item => {
                const elementOne = document.getElementById(`canvas-object-${item.cableData.connections[0].deviceType}-${item.cableData.connections[0].id}`);
                const elementTwo = document.getElementById(`canvas-object-${item.cableData.connections[1].deviceType}-${item.cableData.connections[1].id}`);

                return elementOne && elementTwo && new LeaderLine(
                    elementOne,
                    elementTwo,
                    {
                        startPlug: "behind",
                        endPlug: "behind",
                        color: "black"
                    }
                )
            }).filter(item => !!item));
        }, 20)
    }, [canvasDataItems]);

    const [firstItemToConnect, setFirstItemToConnect] = useState(null);

    return (
        <div ref={drop} className="h-screen relative" onClick={() => {
            setFirstItemToConnect(null);
        }} onContextMenuCapture={(event) => {
            event.preventDefault();
            setFirstItemToConnect(null);
        }}>
            {canvasDataItems.filter(item => ["computer", "switch", "router"].includes(item.deviceType)).map(item => (
                <CanvasObject
                    isSimulationMode={isSimulationMode}
                    item={item}
                    key={item.id}
                    canvasDataItems={canvasDataItems}
                    setCanvasDataItems={setCanvasDataItems}
                    onRightClick={() => {
                        if (!firstItemToConnect) {
                            setFirstItemToConnect({ id: item.id, deviceType: item.deviceType });
                        } else if (firstItemToConnect.id !== item.id) {
                            const secondItemToConnect = { id: item.id, deviceType: item.deviceType };

                            if (canvasDataItems.filter(it =>
                                it.deviceType === "cable" &&
                                (
                                    (
                                        it.cableData.connections[0].id == firstItemToConnect.id &&
                                        it.cableData.connections[0].deviceType == firstItemToConnect.deviceType &&
                                        it.cableData.connections[1].id == secondItemToConnect.id &&
                                        it.cableData.connections[1].deviceType == secondItemToConnect.deviceType
                                    ) ||
                                    (
                                        it.cableData.connections[1].id == firstItemToConnect.id &&
                                        it.cableData.connections[1].deviceType == firstItemToConnect.deviceType &&
                                        it.cableData.connections[0].id == secondItemToConnect.id &&
                                        it.cableData.connections[0].deviceType == secondItemToConnect.deviceType
                                    )
                                )
                            ).length > 0) {
                                // Cable already exists, ignoring
                                return;
                            };

                            const newItems = [...canvasDataItems];
                            newItems.push({
                                deviceType: "cable",
                                id: randomstring.generate(12),
                                cableData: {
                                    connections: [
                                        {
                                            id: firstItemToConnect.id,
                                            deviceType: firstItemToConnect.deviceType
                                        },
                                        {
                                            id: secondItemToConnect.id,
                                            deviceType: secondItemToConnect.deviceType
                                        }
                                    ]
                                }
                            });

                            setCanvasDataItems(newItems);
                            setFirstItemToConnect(null);
                        }
                    }}
                />
            ))}
        </div>
    );
}

export default MainCanvas;