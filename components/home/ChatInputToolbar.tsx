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
  return (
    <TextInput
      editable={!disabled}
      mode="outlined"
      width="100%"
      onChangeText={toolBarProps.textInputProps.onChangeText}
      right={
        !disabled &&
        toolBarProps.text !== "" && (
          <TextInput.Icon icon="send" onPress={toolBarProps.onSend} />
        )
      }
    />
  );
};

export default ChatInputToolbar;
