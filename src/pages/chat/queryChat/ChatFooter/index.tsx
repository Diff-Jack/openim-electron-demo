import { useLatest } from "ahooks";
import { Button } from "antd";
import { t } from "i18next";
import { forwardRef, ForwardRefRenderFunction, memo, useState } from "react";

import sendIcon from "@/assets/images/chatFooter/send_enter.png";
import sendIconGray from "@/assets/images/chatFooter/send_enter_gray.png";
import CKEditor from "@/components/CKEditor";
import { getCleanText } from "@/components/CKEditor/utils";
import i18n from "@/i18n";
import { IMSDK } from "@/layout/MainContentWrap";

import SendActionBar from "./SendActionBar";
import { useFileMessage } from "./SendActionBar/useFileMessage";
import { useSendMessage } from "./useSendMessage";

const sendActions = [
  { label: t("placeholder.sendWithEnter"), key: "enter" },
  { label: t("placeholder.sendWithShiftEnter"), key: "enterwithshift" },
];

i18n.on("languageChanged", () => {
  sendActions[0].label = t("placeholder.sendWithEnter");
  sendActions[1].label = t("placeholder.sendWithShiftEnter");
});

const ChatFooter: ForwardRefRenderFunction<unknown, unknown> = (_, ref) => {
  const [html, setHtml] = useState("");
  const latestHtml = useLatest(html);

  const { getImageMessage } = useFileMessage();
  const { sendMessage } = useSendMessage();

  const onChange = (value: string) => {
    setHtml(value);
  };

  const enterToSend = async () => {
    const cleanText = getCleanText(latestHtml.current);
    const message = (await IMSDK.createTextMessage(cleanText)).data;
    setHtml("");
    if (!cleanText) return;

    sendMessage({ message });
  };

  return (
    <footer className="relative h-full bg-transparent p-2">
      <div className="flex h-full flex-col rounded-md border-[1px] border-[rgb(229,229,229,0.5)] bg-white p-2">
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-md border-[1px] border-[rgb(212,212,212,0.5)] bg-[linear-gradient(to_top,rgba(250,250,250,0.51),rgba(229,229,229,0.51))]">
          <CKEditor value={html} onEnter={enterToSend} onChange={onChange} />
          <div className="flex items-center justify-end py-4 pr-3">
            {/*<Button className="w-fit px-6 py-1" type="primary" onClick={enterToSend}>*/}
            {/*  {t("placeholder.send")}*/}
            {/*</Button>*/}
            <Button
              icon={
                <img
                  src={html === "" ? sendIconGray : sendIcon}
                  alt="icon"
                  className="h-[33px] w-[33px]"
                />
              }
              className="border-0 bg-transparent"
              onClick={enterToSend}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(forwardRef(ChatFooter));
