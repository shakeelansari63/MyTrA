import React from "react";
import { ScrollView, StyleProp, TextStyle, View } from "react-native";
import {
  Divider,
  Menu,
  TextInput,
  TouchableRipple,
  Icon,
  Text,
} from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export type Option = {
  name: string;
  value: string;
  icon?: IconSource | null;
};

type DropdownProps = {
  options: Option[];
  onSelect: (value: string) => void;
  mode?: "flat" | "outlined";
  label?: string;
  disabled?: boolean;
  value?: string;
  placeholder?: string;
  error?: boolean;
  onFocus?: () => void;
  style?: StyleProp<TextStyle>;
};

type DropDownItemProps = {
  option: Option;
  width: number;
  isLast: boolean;
  onSelect: (value: string) => void;
};

const DropDownItem = ({
  option,
  width,
  isLast,
  onSelect,
}: DropDownItemProps) => {
  const dropDownStyle = React.useMemo(
    () => ({
      width: width,
      maxWidth: width,
    }),
    [width],
  );

  // Build Menu Title Component
  const titleComponent = option.icon ? (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Icon size={24} source={option.icon} />
      <Text style={{ marginLeft: 16 }}>{option.name}</Text>
    </View>
  ) : (
    <Text>{option.name}</Text>
  );

  return (
    <>
      <Menu.Item
        key={option.name}
        title={titleComponent}
        style={dropDownStyle}
        titleStyle={dropDownStyle}
        contentStyle={dropDownStyle}
        onPress={() => {
          onSelect(option.value);
        }}
      />
      {!isLast && <Divider />}
    </>
  );
};

const Dropdown = ({
  options,
  onSelect,
  onFocus,
  mode,
  label,
  disabled,
  value,
  placeholder,
  error,
  style,
}: DropdownProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);
  const [dropdownWidth, setDropdownWidth] = React.useState<number>(0);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const onItemSelect = (value: string) => {
    onSelect(value);
    toggleDropdown();
  };

  return (
    <Menu
      visible={visible}
      key={Number(visible)}
      onDismiss={toggleDropdown}
      anchor={
        <TouchableRipple
          onPress={() => {
            toggleDropdown();
            !!onFocus && onFocus();
          }}
          onLayout={(event) => {
            setDropdownWidth(event.nativeEvent.layout.width);
          }}
        >
          <TextInput
            placeholder={placeholder}
            label={label}
            value={value}
            style={style}
            error={error}
            right={
              <TextInput.Icon
                icon={visible ? "menu-up" : "menu-down"}
                pointerEvents="none"
              />
            }
            mode={mode}
            editable={false}
            disabled={disabled}
          />
        </TouchableRipple>
      }
    >
      <ScrollView bounces={true}>
        {options.map((option, idx) => (
          <DropDownItem
            option={option}
            onSelect={onItemSelect}
            key={option.name}
            width={dropdownWidth}
            isLast={idx === options.length - 1}
          />
        ))}
      </ScrollView>
    </Menu>
  );
};

export default Dropdown;
