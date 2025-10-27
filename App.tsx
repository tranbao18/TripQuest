import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Store } from './redux/Store';
import { Provider } from 'react-redux';
import Onboarding from './src/Login/Onboarding';
import Register from './src/Login/Register';
import Login from './src/Login/Login';
import TabNavi from './components/TabNavi';
import InfoDetail from './src/Profile/InfoDetail';
import InfoList from './src/Profile/InfoList';
import ComingSoon from './src/Home/ComingSoon';
import ForgotPassword from './src/Login/ForgetPassword';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* List Login */}
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ title: "Quên mật khẩu" }} />
          <Stack.Screen name="Register" component={Register} />

          {/* List Home */}
          <Stack.Screen name="Main" component={TabNavi} />
          <Stack.Screen name="InfoDetail" component={InfoDetail} />
          <Stack.Screen name="InfoList" component={InfoList} />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
