import "../styles/global.css";
import { ChakraProvider } from "@chakra-ui/react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <DndProvider backend={HTML5Backend}>
                <Component {...pageProps} />
            </DndProvider>
        </ChakraProvider>
    );
}

export default MyApp;