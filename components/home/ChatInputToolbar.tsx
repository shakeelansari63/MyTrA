import React from "react";
import { IMessage, InputToolbarProps } from "react-native-gifted-chat";
import { TextInput } from "react-native-paper";

type ChatInputToolbarProps = {
  toolBarProps: InputToolbarProps<IMessage>;
  disabled: boolean;
};

const ChatInputToolbar = ({
  toolBarProps,
  disabled,
}: ChatInputToolbarProps) => {
  const p = toolBarProps as unknown as {
    text?: string;
    onSend?: (messages: IMessage[]) => void;
    textInputProps?: { onChangeText?: (text: string) => void };
  };
  const onSend = () => {
    const text = p.text?.trim();
    if (!text) return;
    const message: IMessage = {
      _id: Math.random(),
      text,
      createdAt: new Date(),
      user: { _id: 1 },
    };
    p.onSend?.([message]);
    p.textInputProps?.onChangeText?.("");
  };

  return (
    <TextInput
      editable={!disabled}
      mode="outlined"
      style={{ width: "100%" }}
      value={p.text}
      onChangeText={p.textInputProps?.onChangeText}
      right={
        !disabled &&
        p.text !== "" && (
          <TextInput.Icon icon="send" onPress={onSend} />
        )
      }
    />
  );
};

export default ChatInputToolbar;
