import React, { useState, useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../../components/CustomInput";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/Store";
import { UpdateUser } from "../../api/AuthAPI";
import { setUser } from "../../redux/Slices/UserSlice";

const ProfileEditScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);

    const [image, setImage] = useState<string | null>(user?.avatar || require('../../assets/user.png'));

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [location, setLocation] = useState(user?.location || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [age, setAge] = useState<string>(user?.age ? String(user.age) : "");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
            setLocation(user.location || "");
            setGender(user.gender || "");
            setAge(user.age ? String(user.age) : "");
            setImage(user.avatar || null);
        }
    }, [user]);

    // hàm chọn ảnh từ thư viện
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Lỗi', 'Bạn cần cấp quyền truy cập ảnh');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            // Lưu URI ảnh mới, hiển thị preview
            setImage(result.assets[0].uri);
        }
    };


    // hàm update user
    const handleUpdate = async () => {
        if (!user?.id) {
            Alert.alert("Lỗi", "Không tìm thấy user ID");
            return;
        }

        let avatarToSend = user.avatar || "";

        // Nếu ảnh mới chọn là URI local, chuyển sang base64 tạm thời
        if (image && !image.startsWith("http")) {
            const response = await fetch(image);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            await new Promise((resolve) => {
                reader.onloadend = () => {
                    avatarToSend = reader.result as string;
                    resolve(true);
                };
            });
        } else if (image) {
            avatarToSend = image; // ảnh URL
        }

        const updateData = {
            name,
            email,
            phone,
            location,
            gender,
            age: age ? Number(age) : null,
            avatar: avatarToSend,
        };

        const updatedUser = await UpdateUser(user.id, updateData);
        if (updatedUser) {
            dispatch(setUser({ user: updatedUser, token: user?.token || '' }));
            Alert.alert(
                "Thành công",
                "Cập nhật thông tin thành công!",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }
                ]
            );
            setImage(updatedUser.avatar); // show ảnh mới ngay
        } else {
            Alert.alert("Thất bại", "Cập nhật thông tin thất bại!");
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Profile</Text>
            </View>

            {/* Avatar */}
            <View style={{ alignItems: "center", marginVertical: 20 }}>
                <Image
                    source={image ? { uri: image } : require('../../assets/user.png')}
                    style={styles.avatar}
                />

                <TouchableOpacity style={styles.editButton} onPress={pickImage}>
                    <Text style={styles.editText}>Change Avatar</Text>
                </TouchableOpacity>

            </View>

            {/* Form */}
            {[
                { label: "Name", value: name, setter: setName },
                { label: "Email", value: email, setter: setEmail },
                { label: "Mobile no.", value: phone, setter: setPhone },
                { label: "Location", value: location, setter: setLocation },
                { label: "Gender", value: gender, setter: setGender },
                { label: "Age", value: age, setter: setAge },
            ].map((item, index) => (
                <View key={index} style={styles.inputGroup}>
                    <Text style={styles.label}>{item.label}</Text>
                    <View style={styles.inputRow}>
                        <CustomInput
                            value={item.value}
                            onChangeText={item.setter}
                        />
                        <Ionicons name="create-outline" size={20} color="#FF7A00" />
                    </View>
                </View>
            ))}
            <View style={{ alignItems: "center", marginVertical: 20 }}>
                <TouchableOpacity style={styles.editButton} onPress={handleUpdate}>
                    <Text style={styles.editText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileEditScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 60,
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        marginRight: 24,
    },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    editButton: {
        marginTop: 10,
        backgroundColor: "#FF7A00",
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
    },
    editText: {
        color: "#fff",
        fontWeight: "bold"
    },
    inputGroup: {
        marginBottom: 15
    },
    label: {
        fontWeight: "500",
        marginBottom: 6,
        fontSize: 15,
        color: "#FF7A00",
        paddingHorizontal: 10,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    input: { flex: 1, paddingVertical: 10, fontSize: 15 },
});
