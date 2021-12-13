import Head from "next/head";
import HeaderBar from "./HeaderBar";

const DefaultContainer = ({ children, hideBarBottomShadow, noScroll }) => {
    return (
        <div className={`w-screen ${noScroll ? "h-screen overflow-hidden" : "min-h-screen"}`}>
            <Head>
                <title>pacr</title>
            </Head>
            <HeaderBar hideBarBottomShadow={hideBarBottomShadow} />
            <div className="">
                {children}
            </div>
        </div>
    );
}

export default DefaultContainer;