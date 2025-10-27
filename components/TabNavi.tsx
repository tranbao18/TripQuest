import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react'
import InfoList from '../src/Profile/InfoList';
import Favorite from '../src/Home/Favorite';
import Explore from '../src/Home/Explore';
import ComingSoon from '../src/Home/ComingSoon';
import HomeScreen from '../src/Home/HomeScreen';
import TourDetail from '../src/Tour/TourDetail';
import Booking from '../src/Booking/Booking';
import BookingList from '../src/Profile/BookingList';

export default function TabNavi() {

    const Tab = createBottomTabNavigator();
    const HomeStack = createNativeStackNavigator();

    function HomeStackScreen() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="HomeMain" component={HomeScreen} />
                <HomeStack.Screen name="TourDetail" component={TourDetail} options={{ title: 'Tour Detail' }} />
                <HomeStack.Screen name="Booking" component={Booking} options={{ title: 'Booking' }} />
            </HomeStack.Navigator>
        );
    }
    function ExploreStack() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="ExploreMain" component={Explore} />
                <HomeStack.Screen name="TourDetail" component={TourDetail} options={{ title: 'Tour Detail' }} />
                <HomeStack.Screen name="Booking" component={Booking} options={{ title: 'Booking' }} />
            </HomeStack.Navigator>
        );
    }
    function FavoriteStack() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="FavoriteMain" component={Favorite} />
                <HomeStack.Screen name="TourDetail" component={TourDetail} options={{ title: 'Tour Detail' }} />
                <HomeStack.Screen name="Booking" component={Booking} options={{ title: 'Booking' }} />
            </HomeStack.Navigator>
        );
    }
    function ProfileStack() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="ProfileMain" component={InfoList} />
                <HomeStack.Screen name="BookingList" component={BookingList} options={{ title: 'BookingList' }} />
            </HomeStack.Navigator>
        );
    }
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={HomeStackScreen}
                options={{
                    title: "Home", //Set Header Title
                    headerStyle: {
                        backgroundColor: "#fff", //Set Header color
                    },
                    headerTintColor: "#fff", //Set Header text color
                    headerTitleStyle: {
                        fontWeight: "bold", //Set Header text style
                    },
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Explore"
                component={ExploreStack}
                options={{
                    title: "Explore", //Set Header Title
                    headerStyle: {
                        backgroundColor: "#fff", //Set Header color
                    },
                    headerTintColor: "#fff", //Set Header text color
                    headerTitleStyle: {
                        fontWeight: "bold", //Set Header text style
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="explore" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Favorite"
                component={FavoriteStack}
                options={{
                    title: "Favorite", //Set Header Title
                    headerStyle: {
                        backgroundColor: "#fff", //Set Header color
                    },
                    headerTintColor: "#fff", //Set Header text color
                    headerTitleStyle: {
                        fontWeight: "bold", //Set Header text style
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="favorite" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={ProfileStack}
                options={{
                    title: "Account", //Set Header Title
                    headerStyle: {
                        backgroundColor: "#fff", //Set Header color
                    },
                    headerTintColor: "#fff", //Set Header text color
                    headerTitleStyle: {
                        fontWeight: "bold", //Set Header text style
                    },
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({})