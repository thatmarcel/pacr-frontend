import CanvasObject from "./CanvasObject";
import { useDrop } from "react-dnd";
import { useEffect } from "react";

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

    let leaderLines = [];

    useEffect(async () => {
        if (!window.LeaderLine) { return; }

        leaderLines.forEach(line => line.remove());

        leaderLines = canvasDataItems.filter(item => item.deviceType === "cable").map(item => {
            const elementOne = document.getElementById(`canvas-object-${item.cableData.connections[0].deviceType}-${item.cableData.connections[0].id}`);
            const elementTwo = document.getElementById(`canvas-object-${item.cableData.connections[1].deviceType}-${item.cableData.connections[1].id}`);

            return elementOne && elementTwo && new LeaderLine(
                elementOne,
                elementTwo
            )
        }).filter(item => !!item);
    }, [canvasDataItems]);

    return (
        <div ref={drop} className="h-screen relative">
            {canvasDataItems.filter(item => ["computer", "switch", "router"].includes(item.deviceType)).map(item => (
                <CanvasObject
                    isSimulationMode={isSimulationMode}
                    item={item}
                    key={item.id}
                    canvasDataItems={canvasDataItems}
                    setCanvasDataItems={setCanvasDataItems}
                />
            ))}
        </div>
    );
}

export default MainCanvas;