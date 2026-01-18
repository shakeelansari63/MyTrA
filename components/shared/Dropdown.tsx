import React from "react";
import { ScrollView } from "react-native";
import { Divider, Menu, TextInput, TouchableRipple } from "react-native-paper";

export type Option = {
    name: string;
    value: string;
    icon: string | React.ReactNode;
};

type DropdownProps = {
    options: Option[];
    onSelect: (value: string) => void;
    mode?: "flat" | "outlined";
    label?: string;
    disabled?: boolean;
    value?: string;
    placeholder?: string;
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
    return (
        <>
            <Menu.Item
                key={option.name}
                title={option.name}
                contentStyle={{ minWidth: width }}
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
    mode,
    label,
    disabled,
    value,
    placeholder,
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
                    onPress={toggleDropdown}
                    onLayout={(event) => {
                        const { width } = event.nativeEvent.layout;
                        setDropdownWidth(width);
                    }}
                >
                    <TextInput
                        placeholder={placeholder}
                        label={label}
                        value={value}
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
