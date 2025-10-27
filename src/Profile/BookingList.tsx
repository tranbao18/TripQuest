import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import axios from "axios";
import BookingCard from "../../components/BookingCard";

const API_BASE = "https://travel-api-53hr.onrender.com";

interface Booking {
  id: number;
  user_id: number;
  tour_id: string;
  seats_booked: string;
  total_price: number;
}

export default function BookingList() {
  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?.id;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/Bookings?user_id=${userId}`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Không thể tải danh sách đơn đặt tour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách đặt tour</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2b8cff" />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <BookingCard
              id={item.id}
              user_id={item.user_id}
              tour_id={item.tour_id}
              seats_booked={item.seats_booked}
              total_price={item.total_price}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12,marginTop:20 },
  header: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 12,
    textAlign: "center",
  },
});