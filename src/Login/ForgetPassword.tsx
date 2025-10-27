import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ForgotPassword as ForgotPasswordAPI } from "../../api/AuthAPI"; // hàm API quên mật khẩu
import axios from "axios";

const ForgotPassword = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert("Lỗi", "Vui lòng nhập email");
            return;
        }

        try {
            // 1️⃣ Lấy user từ JSON server hiện tại
            const res = await axios.get("https://travel-api-53hr.onrender.com/Users");
            const users = res.data;
            const user = users.find((u: any) => u.email === email);

            if (!user) {
                Alert.alert("Thất bại", "Email không tồn tại");
                return;
            }

            // 2️⃣ Tạo mật khẩu mới
            const newPassword = Math.random().toString(36).slice(-8);

            // 3️⃣ Update password trên JSON server
            await axios.patch(`https://travel-api-53hr.onrender.com/Users/${user.id}`, {
                password_hash: newPassword
            });

            // 4️⃣ Gọi backend Express để gửi email
            await axios.post(
                "https://movies-reviews-backend-uxlx.onrender.com/api/auth/send-email",
                {
                    to: email,
                    subject: "Mật khẩu mới",
                    text: `Mật khẩu mới của bạn là: ${newPassword}`
                }
            );

            Alert.alert("Thành công", "Mật khẩu mới đã được gửi vào email của bạn");
            navigation.goBack(); // quay về Login

        } catch (err: any) {
            console.error(err);
            Alert.alert("Lỗi", "Không thể gửi mật khẩu mới. Vui lòng thử lại.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quên mật khẩu</Text>
            <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Gửi mật khẩu mới</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonForget} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonTextForGet}>Quay về Trang Chủ</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 24, justifyContent: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12 },
    button: { backgroundColor: "#FF7A00", padding: 14, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" },

    buttonForget: { backgroundColor: "#adaaa7ff", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 12 },
    buttonTextForGet: { color: "#fff", fontWeight: "bold" },
});
