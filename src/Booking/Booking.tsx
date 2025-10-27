
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../redux/Store";
import DropDownPicker from "react-native-dropdown-picker";

const API_BASE = "https://travel-api-53hr.onrender.com";

export default function Booking({ route, navigation }: any) {
    const { tour } = route.params;
    const { user } = useSelector((state: RootState) => state.user);
    const userId = user?.id;
    const [seats, setSeats] = useState('1');
    const [coupons, setCoupons] = useState<any[]>([]);
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
    const [total, setTotal] = useState(0);
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const [openCoupon, setOpenCoupon] = useState(false);

    useEffect(()=>{
        fetchCoupons();
        calcTotal();
    },[seats, selectedCoupon]);

    const fetchCoupons = async ()=>{
        try{
            const res = await axios.get(`${API_BASE}/Coupons`);
            setCoupons(res.data || []);
        }catch(err){ console.error(err) }
    }

    const calcTotal = ()=>{
        const n = parseInt(seats)||0;
        const price = tour.price || 0;
        const discount = selectedCoupon ? (selectedCoupon.discount_value||0) : 0;
        const tot = price * n * (1 - discount/100);
        setTotal(tot);
    }

    const openPayment = ()=>{
        const n = parseInt(seats)||0;
        if(n<=0){ Alert.alert('Error','Số lượng phải >0'); return; }
        if(n > tour.available_seats){ Alert.alert('Error','Không đủ chỗ'); return; }
        setPaymentModal(true);
    }

    const doPay = async ()=>{
        if(!paymentMethod){ Alert.alert('Error','Chọn phương thức thanh toán'); return; }
        setLoading(true);
        try{
            const payload:any = {
                user_id: user?.id,
                tour_id: tour.id,
                seats_booked: parseInt(seats),
                total_price: total,
                status: "pending",
                created_at: new Date().toISOString(),
                payment_method: paymentMethod,
                payment_status: "pending",
                coupon_code: selectedCoupon ? selectedCoupon.code : null
            };
            // POST booking
            const res = await axios.post(`${API_BASE}/Bookings`, payload);
            // giảm available seats trong Tours
            await axios.patch(`${API_BASE}/Tours/${tour.id}`, { available_seats: tour.available_seats - parseInt(seats) });
            // giảm số lượng coupon
            if(selectedCoupon){
                await axios.patch(`${API_BASE}/Coupons/${selectedCoupon.id}`, { max_uses: Math.max(0,(selectedCoupon.max_uses||0)-1) });
            }
            setPaymentModal(false);
            Alert.alert('Paid Successfully','Your booking is confirmed');
            navigation.navigate('Home');
        }catch(err){
            console.error(err);
            Alert.alert('Error','Thanh toán thất bại');
        }finally{ setLoading(false); }
    }

    return (
        <View style={{flex:1, padding:12, marginTop:30}}>
            <Text style={{fontWeight:'bold', fontSize:20, marginVertical: 15}}>Booking - {tour.name}</Text>
            {tour.image && <Image source={{uri: tour.image}} style={{width:'100%',height:220,borderRadius:8}} />}
            <View style={{marginTop:12}}>
                <Text style={{  color: "black", fontWeight:"bold" }}>User: </Text>
                <TextInput value={String(user?.name||'')} editable={false} style={styles.input} />
                <Text style={{marginTop:8, color: "black", fontWeight:"bold"}}>Tour: </Text>
                <TextInput value={String(tour.name)} editable={false} style={styles.input} />
                <Text style={{marginTop:8, color: "black", fontWeight:"bold"}}>Số ghế đặt: </Text>
                <TextInput keyboardType='numeric' value={seats} onChangeText={setSeats} style={styles.input} />
                <Text style={{marginTop:8, color: "black", fontWeight:"bold"}}>Mã giảm giá: </Text>
                <DropDownPicker
                    open={openCoupon}
                    value={selectedCoupon ? selectedCoupon.id : null}
                    items={[
                        { label: "Không áp dụng mã giảm giá", value: null },
                        ...coupons.map(c=>({
                        label: `${c.code} - Giảm ${c.discount_value}%`,
                        value: c.id
                    }))]}
                    setOpen={setOpenCoupon}
                    setValue={(callback) => {
                        const val = callback(selectedCoupon ? selectedCoupon.id : null);
                        const coupon = coupons.find(c => c.id === val) || null;
                        setSelectedCoupon(coupon);
                    }}
                    style={{borderColor:'#ccc', marginTop:6}}
                    placeholder="Chọn mã giảm giá"
                />
                <Text style={{marginTop:12,fontSize:16}}>Tổng giá: {total.toLocaleString("vi-VN")}đ</Text>
            </View>

            <TouchableOpacity onPress={openPayment} style={styles.payBtn}><Text style={{color:'#fff'}}>Select Payment</Text></TouchableOpacity>

            <Modal visible={paymentModal} animationType="slide" transparent>
                <View style={{flex:1,justifyContent:'center',backgroundColor:'rgba(0,0,0,0.4)'}}>
                    <View style={{backgroundColor:'#fff',margin:20,padding:16,borderRadius:8}}>
                    <Text style={{fontWeight:'bold',marginBottom:8}}>Select Payment Method</Text>

                    <TouchableOpacity
                        onPress={() => setPaymentMethod('master_card')}
                        style={[
                        styles.payMethod,
                        paymentMethod === 'master_card' && { borderColor: '#FF7A00', backgroundColor: '#e6f0ff' }
                        ]}
                    >
                        <Text>Master Card</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setPaymentMethod('banking')}
                        style={[
                        styles.payMethod,
                        paymentMethod === 'banking' && { borderColor: '#FF7A00', backgroundColor: '#e6f0ff' }
                        ]}
                    >
                        <Text>Net Banking</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setPaymentMethod('credit_card')}
                        style={[
                        styles.payMethod,
                        paymentMethod === 'credit_card' && { borderColor: '#FF7A00', backgroundColor: '#e6f0ff' }
                        ]}
                    >
                        <Text>Credit Card</Text>
                    </TouchableOpacity>

                    <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:12}}>
                        <TouchableOpacity
                        onPress={() => setPaymentModal(false)}
                        style={[styles.payBtn, {backgroundColor:'#ccc'}]}
                        >
                        <Text>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={doPay}
                        style={[styles.payBtn, {backgroundColor: paymentMethod ? '#FF7A00' : '#999'}]}
                        >
                        <Text style={{color:'#fff'}}>Pay</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    input:{borderWidth:1,borderColor:'#ddd',padding:8,borderRadius:6,marginTop:6},
    couponCard:{padding:8,marginRight:8,borderWidth:1,borderColor:'#eee',borderRadius:6},
    payBtn:{marginTop:20,backgroundColor:'#FF7A00',padding:12,alignItems:'center',borderRadius:8},
    payMethod:{padding:10,borderWidth:1,borderColor:'#eee',borderRadius:6,marginTop:8}
});
