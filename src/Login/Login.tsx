import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from 'react-redux'
import CustomInput from "../../components/CustomInput";
import { LoginUser } from "../../api/AuthAPI";
import { setUser } from "../../redux/Slices/UserSlice";
import axios from "axios";


const Login = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState("");


    return (
        <View style={styles.container}>
            <Image
                source={require("../../assets/welcome.png")} // ảnh minh họa Welcome
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.title}>Welcome</Text>
            <CustomInput
                placeholder="Enter your Name or Email"
                value={username}
                onChangeText={setUserName}
                style={styles.input}
            />
            <CustomInput
                placeholder="Enter your Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                <Text style={{ color: "#FF7A00",left: 140, marginBottom: 20 }}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={async () => {
                if (!username || !password) {
                    Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tài khoản và mật khẩu");
                    return;
                }

                const result = await LoginUser(username, password);
                if (result && result.token) {
                    console.log("Login result:", result);
                    dispatch(setUser(result));
                    Alert.alert("Thành công", "Đăng nhập thành công!");
                    // bạn có thể chuyển màn hình tại đây nếu muốn
                    navigation.navigate("Main")
                } else {
                    Alert.alert("Thất bại", "Đăng nhập thất bại");
                }
            }}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.or}>Or</Text>

            <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert("Thông báo", "Hiện tại trang này đang trong quá trình cập nhật. Xin vui lòng quay lại sao.")}>
                <Image source={require("../../assets/google.png")} style={styles.socialIcon} />
                <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert("Thông báo", "Hiện tại trang này đang trong quá trình cập nhật. Xin vui lòng quay lại sao.")}>
                <Image source={require("../../assets/apple.png")} style={styles.socialIcon} />
                <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 24,
        alignItems: "center",
    },
    image: {
        width: 150,
        height: 150,
        marginTop: 50,
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
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
    or: {
        marginVertical: 12,
        color: "#666",
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: "100%",
        marginBottom: 12,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    socialText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#333",
    },
});
