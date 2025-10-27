import React, { useState, useEffect } from "react";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { GetTours, GetFavoritesTours, ToggleFavorite } from "../../api/AuthAPI";
import TourCard from "../../components/TourCard";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { TabParamList } from './HomeScreen';

interface TourItem {
    id: string;
    name: string;
    departure_location: string;
    image: string;
    price: number;
    status: boolean;
}
type NavProp = BottomTabNavigationProp<TabParamList, "Explore">;

const ExploreScreen = () => {
    const navigation = useNavigation<NavProp>();
    const { user } = useSelector((state: RootState) => state.user);
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
            const popularTours = data.filter((tour: TourItem) => tour.status === true);
            setTours(popularTours);
            setLoading(false);
        };

        fetchTours();
        loadFavorites();
    }, [userId]);


    useEffect(() => {
        if (isFocused && userId) {
            loadFavorites();
        }
    }, [isFocused, userId]);

    const handleToggleFavorite = async (tour: TourItem) => {
        if (!userId) return;

        await ToggleFavorite(userId, tour.id);

        await loadFavorites();
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
            <Text style={styles.header}>Explore</Text>

            <FlatList
                data={tours}
                style={{ flex: 1 }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TourCard
                        id={item.id}
                        name={item.name}
                        departure_location={item.departure_location}
                        image={item.image}
                        price={item.price}
                        isFavorite={favorites.some(f => f.id === item.id)} // check active tym
                        onFavoritePress={() => handleToggleFavorite(item)} // toggle như FavoriteScreen
                        onPress={()=>navigation.navigate('TourDetail', {tourId: item.id})}
                    />
                )}
            />
        </View>
    );
};

export default ExploreScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        marginTop: 50,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        marginVertical: 15,
    },
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
        backgroundColor: "rgba(0,0,0,0.4)", // thêm để nhìn thấy chữ
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
