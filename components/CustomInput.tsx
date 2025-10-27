import React from "react";
import { TextInput, Text, StyleSheet, KeyboardTypeOptions, TextStyle, ViewStyle } from "react-native";

type CustomInputProps = {
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    error?: string;
    style?: TextStyle; // style cho input
};

const CustomInput = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = "default",
    error,
    style,
}: CustomInputProps) => {
    return (
        <>
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
    );
};

export default CustomInput;

const styles = StyleSheet.create({
    input: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 10,
    },
    error: {
        marginTop: 4,
        fontSize: 12,
        color: "red",
    },
});
