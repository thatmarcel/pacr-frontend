import { useEffect } from "react";
import DefaultContainer from "../../components/DefaultContainer";

import strings from "../../misc/strings.json";
import urls from "../../misc/urls.json";

import fetch from "isomorphic-unfetch";
import { useRouter } from "next/router";

import randomstring from "randomstring";

const cloneDocumentPage = () => {
    const router = useRouter();
    const { id } = router.query;

    useEffect(async () => {
        if (id) {
            const fetchResponse = await fetch(`${urls.backendBaseURL}/doc/fetch?id=${id}`);
            const content = await fetchResponse.text();
            
            const newDocId = randomstring.generate(6);

            await fetch(`${urls.backendBaseURL}/doc/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: newDocId,
                    content: content
                })
            });

            router.push(`/editor?id=${newDocId}`);
        } else {
            router.push("/editor");
        }
    }, [id]);

    return (
        <DefaultContainer>
            <div className="p-8">
                <p>
                    {strings.loading}...
                </p>
            </div>
        </DefaultContainer>
    )
}

export default cloneDocumentPage;