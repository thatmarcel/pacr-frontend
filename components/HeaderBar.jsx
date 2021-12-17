import {
    IconButton,
    Button,

    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,

    Link as ChakraLink
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { InfoOutlineIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import Link from "next/link";
import strings from "../misc/strings.json";

const HeaderBar = ({ hideBarBottomShadow }) => {
    const { isOpen: isAboutModalOpen, onOpen: onAboutModalOpen, onClose: onAboutModalClose } = useDisclosure();

    return (
        <div className={`w-full h-16 flex ${hideBarBottomShadow ? "" : "border-b-2 border-gray"}`}>
            <Link href="/">
                <a className="align-middle my-auto ml-8 text-xl font-bold select-none">
                    {strings.appName}
                </a>
            </Link>

            <div className="grow" /> {/* Spacer */}

            <IconButton marginY="auto" marginRight={4} icon={<InfoOutlineIcon />} onClick={onAboutModalOpen} />

            <Modal isOpen={isAboutModalOpen} onClose={onAboutModalClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {strings.aboutThisSite}
                    </ModalHeader>
                    <ModalBody>
                        <ChakraLink isExternal={true} display="block" href="https://github.com/thatmarcel/pacr-frontend">
                            {strings.goToFrontendSourceCode} <ExternalLinkIcon mx="2px" />
                        </ChakraLink>

                        <ChakraLink isExternal={true} marginTop={4} marginBottom={8} display="block" href="https://github.com/thatmarcel/pacr-backend">
                            {strings.goToBackendSourceCode} <ExternalLinkIcon mx="2px" />
                        </ChakraLink>

                        <p>
                            {strings.acknowledgementsText}
                        </p>

                        <p className="mt-4">
                            {strings.pronounciationNote}
                        </p>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onAboutModalClose}>
                            {strings.close}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default HeaderBar;