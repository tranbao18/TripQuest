import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../../components/CustomInput"; // import component mới
import { RegisterUser } from "../../api/AuthAPI";

const Register = () => {
    const navigation = useNavigation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password_hash, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password_hash || !confirmPassword) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        if (password_hash !== confirmPassword) {
            Alert.alert("Lỗi", "Mật khẩu không khớp!");
            return;
        }

        setLoading(true);

        const result = await RegisterUser({ name, email, password_hash });

        setLoading(false);

        if (result) {
            Alert.alert("Thành công", "Đăng ký thành công!", [
                { text: "OK", onPress: () => navigation.navigate("Login") }
            ]);
            // Optionally clear form
            setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
        }
    };


    return (
        <View style={styles.container}>
            <Image source={require("../../assets/create_account.png")}
                style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>Create Account</Text>

            <CustomInput
                placeholder="Enter your Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <CustomInput
                placeholder="Enter your Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
            />

            <CustomInput
                placeholder="Enter your Password"
                value={password_hash}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <CustomInput
                placeholder="Re-enter your Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Đang đăng ký..." : "Sign me up!"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.footerText}>
                    Already have an account?{" "}
                    <Text style={styles.login}>log in</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 24,
        alignItems: "center",
    },
    image: { width: 200, height: 150, marginTop: 40, marginBottom: 10, },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        maxHeight: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#FF7A00",
        paddingVertical: 14,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    footerText: {
        marginTop: 20,
        color: "#666",
    },
    login: {
        color: "#FF7A00",
        fontWeight: "bold",
    },
});
