import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { RootState } from "../../redux/Store";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/Slices/UserSlice';
import ComingSoon from '../Home/ComingSoon';
const InfoList = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (user?.avatar) {
            setImage(user.avatar);
        }
    }, [user]);

    const handleLogout = () => {
        dispatch(logout()); // clear redux user
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" as never }], // chuyển về màn Login
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../../assets/banner_travel.png')}
                    style={styles.banner}
                />
                <Image
                    source={image ? { uri: image } : require('../../assets/user.png')}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.phone}>{user.phone}</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate("InfoDetail")}
                >
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>

            {/* Menu Info */}
            <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("BookingList")}>
                <Ionicons name="book-outline" size={25} color="#FF7A00" />
                <Text style={styles.menuText}>Booking Details</Text>
                <Ionicons name="chevron-forward" size={20} color="#aaa" />
            </TouchableOpacity>
                {[
                    { icon: "information-circle-outline", label: "About Us" },
                    { icon: "language-outline", label: "Language" },
                    { icon: "help-circle-outline", label: "Help Centre" },
                    { icon: "people-outline", label: "Invite friend" },
                    { icon: "document-text-outline", label: "Privacy Policy" },
                ].map((item, index) => (
                    <TouchableOpacity key={index} style={styles.menuItem} 
                    onPress={() => Alert.alert("Thông báo", "Hiện tại trang này đang trong quá trình cập nhật. Xin vui lòng quay lại sao.")}
                    >
                        <Ionicons name={item.icon as any} size={25} color="#FF7A00" />
                        <Text style={styles.menuText}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#aaa" />
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={25} color="#fff" />
                <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default InfoList

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        alignItems: "center",
        marginTop: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    banner: {
        width: "100%",
        height: 100,
        position: "absolute",
        top: 30,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: "#fff",
        marginTop: 50,
    },
    name: { fontSize: 20, fontWeight: "bold", marginTop: 8 },
    email: { fontSize: 14, color: "#666", marginTop: 4 },
    phone: { fontSize: 14, color: "#666" },
    editButton: {
        position: "absolute",
        top: 15,
        right: 20,
        backgroundColor: "#FF7A00",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    editText: { color: "#fff", fontWeight: "bold" },
    menu: { marginTop: 20 },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 27,
        paddingHorizontal: 35,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: "#333", fontWeight: "500" },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF7A00",
        margin: 20,
        paddingVertical: 14,
        borderRadius: 30,
    },
    logoutText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 8,
    },
})