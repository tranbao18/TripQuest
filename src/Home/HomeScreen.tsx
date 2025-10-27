
import React, { useEffect, useState } from 'react';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import TourCard from '../../components/TourCard';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/Slices/UserSlice';
import { GetFavoritesTours, ToggleFavorite } from "../../api/AuthAPI";
import { RootState } from "../../redux/Store";
import Ionicons from '@expo/vector-icons/Ionicons';

const API_BASE = "https://travel-api-53hr.onrender.com";

export type TabParamList = {
    Home: undefined;
    TourDetail: { tourId: string };
    Booking: { tour: any };
    Explore: undefined;
    Favorite: undefined;
    Account: undefined;
    Login: undefined;
};

interface TourItem {
    id: string;
    name: string;
    departure_location: string;
    image: string;
    price: number;
    is_popular: boolean;
}

type NavProp = BottomTabNavigationProp<TabParamList, "Home">;

export default function HomeScreen() {
    const navigation = useNavigation<NavProp>();
    const { user } = useSelector((state: RootState) => state.user);
    const userId = user?.id;
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [favorites, setFavorites] = useState<TourItem[]>([]);
    const [image, setImage] = useState<string | null>(null);

    const PAGE_SIZE = 6;

    useEffect(() => {
        if (user?.avatar) {
            setImage(user.avatar);
        }
    }, [user]);

    useEffect(() => {
        fetchTours(page, search);
    }, [page]);

    const loadFavorites = async () => {
        if (!userId) return;
        const favs = await GetFavoritesTours(userId);
        setFavorites(favs);
    };

    const fetchTours = async (pageNum = 1, q = '') => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/Tours?_page=${pageNum}&_limit=${PAGE_SIZE}${q ? `&q=${q}` : ''}`);
            const total = res.headers['x-total-count'] ? parseInt(res.headers['x-total-count']) : res.data.length;
            setTotalPages(Math.max(1, Math.ceil(total / PAGE_SIZE)));
            setTours(res.data);
            loadFavorites();
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Không thể tải danh sách tour');
        } finally {
            setLoading(false);
        }
    }

    const handleToggleFavorite = async (tour: TourItem) => {
        if (!userId) return;

        await ToggleFavorite(userId, tour.id);
        await loadFavorites(); // gọi lại để chắc chắn sync
    };

    const onSearch = () => {
        setPage(1);
        fetchTours(1, search);
    }

    const cancelSearch = () => {
        setPage(1);
        setSearch("");
        fetchTours(1, "");
    }

    const gotoProfile = () => navigation.navigate('Account');

    const doLogout = () => {
        dispatch(logout());
        navigation.navigate('Login');
    }

    return (
        <View style={{ flex: 1, padding: 12, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                <View>
                    <Image
                        source={image ? { uri: image } : require('../../assets/user.png')}
                        style={styles.avatar}
                    />
                </View>
                <TouchableOpacity onPress={gotoProfile} style={{flex: 1}}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Chào {user?.name || 'Guest'}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.searchRow}>
                <TextInput placeholder="Search tours..." value={search} onChangeText={setSearch} style={styles.input} />
                <TouchableOpacity onPress={cancelSearch} style={styles.searchBtnl}><Ionicons name="close-circle-outline" size={18} /></TouchableOpacity>
                <TouchableOpacity onPress={onSearch} style={styles.searchBtn}><Ionicons name="search" size={18} /></TouchableOpacity>
            </View>

            {loading ? <ActivityIndicator size="large" style={{ marginTop: 20 }} /> :
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
                            onPress={() => navigation.navigate('TourDetail', { tourId: item.id })}
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            }

            <View style={styles.pager}>
                {page > 2 && <TouchableOpacity onPress={() => setPage(1)} style={styles.pagerBtn}><Text>First</Text></TouchableOpacity>}
                {page > 1 && <TouchableOpacity onPress={() => setPage(prev => Math.max(1, prev - 1))} style={styles.pagerBtn}><Text>Prev</Text></TouchableOpacity>}
                <View style={styles.pageInput}>
                    <TextInput keyboardType='numeric' value={String(page)} onChangeText={(t) => { const n = parseInt(t) || 0; setPage(n); }} style={{ textAlign: 'center' }} />
                </View>
                {page < totalPages && <TouchableOpacity onPress={() => setPage(prev => Math.min(totalPages, prev + 1))} style={styles.pagerBtn}><Text>Next</Text></TouchableOpacity>}
                {page != totalPages && <TouchableOpacity onPress={() => setPage(totalPages)} style={styles.pagerBtn}><Text>Last</Text></TouchableOpacity>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: "#fff",
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 40 },
    headerBtn: { backgroundColor: '#eee', padding: 8, borderRadius: 8, marginLeft: 8 },
    searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 8, marginRight: 8 },
    searchBtnl: { padding: 10, backgroundColor: '#ff7b00db', borderRadius: 8, marginRight: 5 },
    searchBtn: { padding: 10, backgroundColor: '#ff7b00db', borderRadius: 8 },
    pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 1 },
    pagerBtn: { padding: 8, marginHorizontal: 4, backgroundColor: '#ff7b00db', borderRadius: 6 },
    pageInput: { width: 60, height: 40, justifyContent: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginHorizontal: 2 }
});
