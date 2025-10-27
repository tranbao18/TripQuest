// Onboarding.tsx
import React, { useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";



const Onboarding = () => {

    const swiperRef = useRef<Swiper>(null);
    const navigation = useNavigation();

    const goNext = () => {
        swiperRef.current?.scrollBy(1);
    };

    return (
        <Swiper
            ref={swiperRef}
            loop={false}
            dotStyle={styles.dot}
            activeDotStyle={styles.activeDot}
            scrollEnabled={false}
        >
            {/* Screen 1 */}
            <View style={styles.slide}>
                <Image
                    source={require("../../assets/plant.png")}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Plan Your Trip</Text>
                <Text style={styles.desc}>
                    Lorem ipsum dolor sit amet consectetur. At condimentum sed sed
                    consectetur.
                </Text>
                <TouchableOpacity style={styles.button} onPress={goNext}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* Screen 2 */}
            <View style={styles.slide}>
                <Image
                    source={require("../../assets/booking.png")}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Book your Ticket</Text>
                <Text style={styles.desc}>
                    Lorem ipsum dolor sit amet consectetur. At condimentum sed sed
                    consectetur.
                </Text>
                <TouchableOpacity style={styles.button} onPress={goNext}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>

            {/* Screen 3 */}
            <View style={styles.slide}>
                <Image
                    source={require("../../assets/enjoy.png")}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Enjoy the Vacation</Text>
                <Text style={styles.desc}>
                    Lorem ipsum dolor sit amet consectetur. At condimentum sed sed
                    consectetur.
                </Text>
                <TouchableOpacity style={styles.button} onPress={goNext}>
                    <Text style={styles.buttonText}>Let’s Start</Text>
                </TouchableOpacity>
            </View>

            {/* Screen 4 */}
            <View style={styles.slide}>
                <Image
                    source={require("../../assets/couple.png")}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Explore the World</Text>
                <Text style={styles.desc}>
                    Pick your bags up and explore the world with ease. Welcome to our
                    Travel App.
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={styles.buttonText}>Sign me up!</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.link}>
                        Already have an account? <Text style={styles.login}>Log in</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </Swiper>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        backgroundColor: "#fff",
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 30,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 12,
        textAlign: "center",
    },
    desc: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#FF7A00",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    link: {
        fontSize: 14,
        color: "#666",
        marginTop: 8,
    },
    login: {
        color: "#FF7A00",
        fontWeight: "bold",
    },
    dot: {
        backgroundColor: "#ccc",
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
    activeDot: {
        backgroundColor: "#FF7A00",
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 3,
    },
});

export default Onboarding;
