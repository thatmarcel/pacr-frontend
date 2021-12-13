import Link from "next/link";
import strings from "../misc/strings.json";

const HeaderBar = ({ hideBarBottomShadow }) => {
    return (
        <div className={`w-full h-16 flex ${hideBarBottomShadow ? "" : "border-b-2 border-gray"}`}>
            <Link href="/">
                <a className="align-middle my-auto ml-8 text-xl font-bold select-none">
                    {strings.appName}
                </a>
            </Link>
        </div>
    );
}

export default HeaderBar;