import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { Ionicons } from "@expo/vector-icons";
import { GetTours, GetFavoritesTours, ToggleFavorite } from "../api/AuthAPI";
interface TourCardProps {
    id: string;
    name: string;
    departure_location: string;
    image: string;
    price: number;
    isFavorite?: boolean;
    onFavoritePress?: () => void;
    onPress?: () => void;
}

interface TourItem {
    id: string;
    name: string;
    departure_location: string;
    image: string;
    price: number;
    is_popular: boolean;
}

const TourCard: React.FC<TourCardProps> = ({
    id,
    name,
    departure_location,
    image,
    price,
    isFavorite = false,
    onFavoritePress,
    onPress,
}) => {

    const { user } = useSelector((state: RootState) => state.user);
    const userId = user?.id;

    const [tours, setTours] = useState<TourItem[]>([]);
    const [favorites, setFavorites] = useState<TourItem[]>([]);
    const [loading, setLoading] = useState(true);

    const handleToggleFavorite = async (tour: TourItem) => {
        if (!userId) return;

        await ToggleFavorite(userId, tour.id);

        setFavorites(prev => {
            const exists = prev.find(f => f.id === tour.id);
            if (exists) {
                // đã có → xóa
                return prev.filter(f => f.id !== tour.id);
            } else {
                // chưa có → thêm
                return [...prev, tour];
            }
        });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image source={{ uri: image }} style={styles.image} />
            <View style={styles.overlay}>
                <Text style={styles.title}>{name}</Text>
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={14} color="#fff" />
                    <Text style={styles.location}>{departure_location}</Text>
                </View>
                <Text style={styles.price}>{price.toLocaleString("vi-VN")} đ</Text>
            </View>
            <View style={styles.favoriteIcon}>
                <TouchableOpacity onPress={onFavoritePress}>
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={isFavorite ? "orange" : "#fff"}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default TourCard;

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
    favoriteIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 20,
        padding: 4,
    },
    price: {
        marginTop: 5,
        fontSize: 14,
        color: "#FFD700",
        fontWeight: "bold",
    },
});
