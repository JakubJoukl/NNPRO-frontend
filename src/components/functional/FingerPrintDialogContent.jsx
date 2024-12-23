import {useFetchCall} from "../../hooks/useFetchCall.js";
import {FingerprintDialogContentUI} from "../visual/FingerprintDialogContentUI.jsx";
import {useMemo} from "react";

export function FingerPrintDialogContent({conversation, decryptedKey}) {
    const dtoIn = useMemo(() => ({id: conversation.conversationId}), [conversation]);
    const {dtoOut, status, resetErr} = useFetchCall("listUsersInConversation", dtoIn, null);

    return FingerprintDialogContentUI({decryptedKey, conversationUsers: dtoOut ?? [], status, resetErr});
}