import CanvasObject from "./CanvasObject";
import { useDrop } from "react-dnd";

import strings from "../misc/strings.json";

const MainCanvas = ({ isSimulationMode, canvasDataItems, setCanvasDataItems }) => {
    const [, drop] = useDrop(() => ({
        accept: "canvasObject",
        drop(item, monitor) {
            console.log("dropped");

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

    return (
        <div ref={drop} className="h-screen relative">
            {canvasDataItems.filter(item => ["computer", "switch", "router"].includes(item.deviceType)).map(item => (
                <CanvasObject isSimulationMode={isSimulationMode} item={item} key={item.id} canvasDataItems={canvasDataItems} setCanvasDataItems={setCanvasDataItems} />
            ))}
        </div>
    );
}

export default MainCanvas;