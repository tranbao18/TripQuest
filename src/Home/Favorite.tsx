import React, { useState, useEffect } from "react";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { GetTours } from "../../api/AuthAPI";
import TourCard from "../../components/TourCard";
import { GetFavoritesTours, ToggleFavorite } from "../../api/AuthAPI";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { TabParamList } from './HomeScreen';

interface TourItem {
    id: string;
    name: string;
    departure_location: string;
    image: string;
    price: number;
    is_popular: boolean;
}
type NavProp = BottomTabNavigationProp<TabParamList, "Favorite">;

const FavoriteScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { user } = useSelector((state: RootState) => state.user); // lấy user từ Redux
    const userId = user?.id;
    const isFocused = useIsFocused();

    const [tours, setTours] = useState<TourItem[]>([]);
    const [favorites, setFavorites] = useState<TourItem[]>([]);
    const [loading, setLoading] = useState(true);


    const loadFavorites = async () => {
        if (!userId) return;
        const favs = await GetFavoritesTours(userId);
        setFavorites(favs);
    };

    useEffect(() => {
        const fetchTours = async () => {
            setLoading(true);
            const data = await GetTours();
            const popularTours = data.filter((tour: TourItem) => tour.is_popular === true);
            setTours(popularTours);
            setLoading(false);
        };

        fetchTours();
    }, []);

    // Mỗi lần screen Favorite được focus lại → gọi API
    useEffect(() => {
        if (isFocused) {
            loadFavorites();
        }
    }, [isFocused, userId]);

    const handleToggleFavorite = async (tour: TourItem) => {
        if (!userId) return;

        await ToggleFavorite(userId, tour.id);
        await loadFavorites(); // gọi lại để chắc chắn sync
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF7A00" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Favorites</Text>

            {favorites.length === 0 ? (
                <Text style={styles.emptyText}>Chưa có tour nào trong danh sách yêu thích.</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => item.id}
                    numColumns={2}   // 2 cột thay vì 3
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.favoriteCard}>
                            <Image source={{ uri: item.image }} style={styles.favoriteImage} />
                            <View style={styles.favoriteContent}>
                                <Text style={styles.favoriteTitle}>{item.name}</Text>
                                <View style={styles.row}>
                                    <Ionicons name="location-outline" size={14} color="#444" />
                                    <Text style={styles.location}>{item.departure_location}</Text>
                                </View>
                                <TouchableOpacity style={styles.bookButton}>
                                    <Text style={styles.bookText}>Book Now</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.heartIcon}>
                                <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
                                    <Ionicons
                                        name="heart"
                                        size={20}
                                        color="orange"
                                    />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}

            <View style={styles.sectionHeader}>
                <Text style={styles.header}>For You</Text>
            </View>

            <FlatList
                data={tours}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TourCard
                        id={item.id}
                        name={item.name}
                        departure_location={item.departure_location}
                        image={item.image}
                        price={item.price}
                        isFavorite={favorites.some(f => f.id === item.id)}
                        onFavoritePress={() => handleToggleFavorite(item)}
                        onPress={()=>navigation.navigate('TourDetail', {tourId: item.id})}
                    />
                )}
            />
        </View>
    );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        paddingHorizontal: 15,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        marginVertical: 15,
    },
    favoriteCard: {
        flex: 1,
        margin: 8,
        borderRadius: 12,
        backgroundColor: "#fff",
        elevation: 2,
        overflow: "hidden",
        maxWidth: "48%",   // để chia 2 cột
        height: 240,       // 👈 cố định chiều cao item
    },
    favoriteImage: {
        width: "100%",
        height: 130,       // 👈 ảnh cao cố định
    },

    emptyText: { fontSize: 14, color: "#666" },

    favoriteContent: {
        flex: 1,
        padding: 8,
        justifyContent: "space-between",
    },
    favoriteTitle: {
        fontSize: 14,
        fontWeight: "bold",
        lineHeight: 18,     // 👈 tăng khoảng cách chữ cho dễ đọc
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    location: {
        fontSize: 12,
        marginLeft: 4,
        color: "#444",
    },
    locationWhite: {
        fontSize: 12,
        marginLeft: 4,
        color: "#fff",
    },
    bookButton: {
        marginTop: 6,
        marginBottom: 20,
        backgroundColor: "black",
        paddingVertical: 5,
        borderRadius: 6,
        alignItems: "center",
    },
    bookText: {
        color: "#fff",
        fontSize: 12,
    },
    heartIcon: {
        position: "absolute",
        top: 8,
        right: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    seeAll: {
        fontSize: 14,
        color: "orange",
    },
    recommendCard: {
        marginBottom: 15,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "#eee",
    },
    recommendImage: {
        width: "100%",
        height: 180,
    },
    overlay: {
        position: "absolute",
        bottom: 10,
        left: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    favoriteIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 20,
        padding: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
