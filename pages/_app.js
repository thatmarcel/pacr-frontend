import "../styles/global.css";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import PlausibleProvider from "next-plausible";

function MyApp({ Component, pageProps }) {
    return (
        <PlausibleProvider domain="pacr.app">
            <ChakraProvider>
                <DndProvider backend={HTML5Backend}>
                    <Component {...pageProps} />
                </DndProvider>
            </ChakraProvider>
        </PlausibleProvider>
    );
}

export default MyApp;