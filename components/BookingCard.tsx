import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { Ionicons } from "@expo/vector-icons";
import axios from 'axios';

const API_BASE = "https://travel-api-53hr.onrender.com";

interface BookingCardProps {
    id: number;
    user_id: number,
    tour_id: string;
    seats_booked: string;
    total_price: number;
    onPress?: () => void;
}

interface TourItem {
    id: string;
    name: string;
    departure_location: string;
    image: string;
}

const BookingCard: React.FC<BookingCardProps> = ({
    id,
    user_id,
    tour_id,
    seats_booked,
    total_price,
    onPress,
}) => {

    const [tours, setTours] = useState<TourItem[]>([]);
    const [loading, setLoading] = useState(true);

    const findBooking = async () => {
        if (!user_id) return;
        try{
            setLoading(true);
            const data = await axios.get(`${API_BASE}/Tours/${tour_id}`);
            setTours(data.data)
        }catch(err){
            console.error(err);
            Alert.alert('Error','Không thể tải danh sách booking');
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        findBooking();
    }, []);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: tours.image }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.title}>{tours.name}</Text>
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={14} color="#fff" />
                    <Text style={styles.location}>{tours.departure_location}</Text>
                </View>
                <Text style={styles.price}>Đã đặt: {seats_booked} ghế</Text>
                <Text style={styles.price}>Tổng giá: {total_price.toLocaleString("vi-VN")}đ</Text>
            </View>
        </TouchableOpacity>
    );
};

export default BookingCard;

const styles = StyleSheet.create({
    card: {
        marginBottom: 15,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#eee",
    },
    image: {
        width: "100%",
        height: 180,
    },
    overlay: {
        position: "absolute",
        bottom: 10,
        left: 10,
        backgroundColor: "rgba(0,0,0,0.4)",
        padding: 5,
        borderRadius: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    location: {
        fontSize: 13,
        color: "#fff",
        marginLeft: 4,
    },
    price: {
        marginTop: 5,
        fontSize: 14,
        color: "#FFD700",
        fontWeight: "bold",
    },
});