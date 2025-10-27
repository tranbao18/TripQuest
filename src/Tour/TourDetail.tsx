import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TabParamList } from '../Home/HomeScreen';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const API_BASE = "https://travel-api-53hr.onrender.com";
type RouteType = RouteProp<TabParamList, 'TourDetail'>;
type NavProp = BottomTabNavigationProp<TabParamList, "TourDetail">;

export default function TourDetail() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteType>();
  const { tourId } = route.params || {};
  const tourID = String(tourId);
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tourId) {
      Alert.alert('Lỗi', 'Không tìm thấy tourId');
      setLoading(false);
      return;
    }
    const fetchTour = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/Tours/${tourID}`);
        setTour(res.data);
      } catch (err) {
        console.error('fetchTour error', err);
        Alert.alert('Lỗi', 'Không tải được thông tin tour');
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [tourId]);

  if (loading) return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large" />
    </View>
  );

  if (!tour) return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text>Không có thông tin tour</Text>
    </View>
  );

  return (
    <ScrollView style={{paddingLeft:20, paddingRight:20, marginTop:40}}>
      <Text style={{fontSize:30,fontWeight:'bold',marginTop:20,marginBottom:10}}>{tour.name}</Text>
      {tour.image && <Image source={{uri: tour.image}} style={{width:'100%',height:220,borderRadius:8}} />}
      <Text style={{marginTop:6, fontWeight:"bold"}}><Ionicons name="location" size={14}/> {tour.departure_location}</Text>
      <Text style={{marginTop:12}}>{tour.description || 'Không có mô tả'}</Text>

      {/* hiển thị các thông tin khác nếu có */}
      <View style={{marginTop:16}}>
        <Text style={{ color: "#FF7A00", fontWeight:"bold" }}><Ionicons name="bus" size={14}/> Lịch trình: </Text>
        <FlatList
            showsVerticalScrollIndicator={false}
            data={tour.schedules}
            renderItem={({item})=>(<Text>{item}</Text>)}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            contentContainerStyle={{paddingBottom:20}}
        />
      </View>
      <View style={{marginTop:16}}>
        <Text style={{ color: "#FF7A00", fontWeight:"bold" }}><Ionicons name="cash" size={14}/> Giá: <Text style={{  color: "black", fontWeight:"bold" }}> {tour.price ? tour.price.toLocaleString("vi-VN") + 'đ/người' : 'Liên hệ'}</Text></Text>
        <Text style={{ color: "#FF7A00", fontWeight:"bold" }}><Ionicons name="man" size={14}/> Số lượng còn lại: <Text style={{  color: "black", fontWeight:"bold" }}>{tour.available_seats ?? 'Không có'}</Text></Text>
      </View>

      <TouchableOpacity style={styles.bookBtn} onPress={()=> navigation.navigate('Booking', { tour })}>
        <Text style={{color:'#fff',fontWeight:'bold'}}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bookBtn:{marginTop:20,backgroundColor:'#FF7A00',padding:12,alignItems:'center',borderRadius:8},
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 15,
  }
});