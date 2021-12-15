import DefaultContainer from "../components/DefaultContainer";

import {
    Button
} from "@chakra-ui/react";

import strings from "../misc/strings.json";
import Link from "next/link";

const Index = () => {
    return (
        <DefaultContainer>
            <div className="p-8">
                <h1 className="font-extrabold text-2xl md:text-5xl mb-6 mt-16 text-center">
                    {strings.indexPageTitle}
                </h1>

                <div className="flex">
                    <Link href="/editor">
                        <a className="mx-auto">
                            <Button>
                                {strings.goToEditorButtonTitle}
                            </Button>
                        </a>
                    </Link>
                </div>
            </div>
        </DefaultContainer>
    );
}

export default Index;