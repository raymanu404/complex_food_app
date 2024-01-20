import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';

//screens
import Login from './app/screens/loginScreen';
import Register from './app/screens/registerScreen';
import Loading from './app/screens/loading';

//StackScreens
import DetailsCategories from './app/screens/inStackScreen/detailsCategoriesScreen';
import DetailsStandard from './app/screens/inStackScreen/detailsStandardScreen';
import ConfirmCode from './app/screens/inStackScreen/ConfirmCodeScreen';
import CouponsList from './app/screens/inStackScreen/CouponsListScreen';
import OrdersScreen from './app/screens/inStackScreen/OrdersScreen';
import OrderItemsScreen from './app/screens/inStackScreen/OrderItemsScreen';
import CheckoutPayment from './app/screens/inStackScreen/CheckoutPayment';
import ForgotPassword from './app/screens/inStackScreen/ForgotPasswordScreen';
import SendEmail from './app/screens/inStackScreen/SendEmailScreen';

//tabs
import Home from './app/screens/tabs/homeScreen';
import Cart from './app/screens/tabs/cartScreen';
import Tickets from './app/screens/tabs/ticketsScreen';
import Profile from './app/screens/tabs/profileScreen';
import PayDesk from './app/screens/inStackScreen/Paydesk';

//useful
import colors from './config/colors/colors';
import {AuthContext} from './config/context';
import {Memoize} from './config/Memoize';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const AppBottomTab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CartStack = createStackNavigator();

export const UserContext = React.createContext();
export const MenuProductsContext = React.createContext();

function App() {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // momentan lasam astea default
  const [userDataLogin, setUserDataLogin] = useState({
    id: 1,
    firstname: 'O',
    lastname: 'V',
    email: 'vasi@email.com',
    password: '1234A',
    gender: 'M',
    phonenumber: '072314141',
    confirmed: true,
    balance: 381,
    coupons: [],
    cartId: 0,
  });

  const authContext = useMemo(() => {
    return {
      login: props => {
        setIsLoading(false);
        setUserToken('la fel ceva token aici ');
        setUserDataLogin({
          email: props.email,
          firstName: props.firstName,
          id: props.id,
          lastName: props.lastName,
          phonenumber: props.phoneNumber,
          gender: props.gender,
          password: props.password,
          balance: props.balance,
          coupons: props.coupons,
        });
      },

      register: () => {
        setIsLoading(false);
        setUserToken(null);
      },
      logout: () => {
        setIsLoading(false);
        setUserToken(null);
      },
    };
  }, []);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => loadingTimer;
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  //HomeStackScreen
  const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={{headerShown: false}}>
      {/* HOME SCREEN */}
      <HomeStack.Screen
        name="HomeScreen"
        component={Home}
        options={{
          title: 'Home',
        }}
      />
      {/* DETAILS FOR STANDARD SCREEN */}
      <HomeStack.Screen
        name="DetailsStandardScreen"
        component={DetailsStandard}
        options={{
          title: 'Details Standard',
        }}
      />
      {/* DETAILS FOR CATEGORIES SCREEN */}
      <HomeStack.Screen
        name="DetailsCategoriesScreen"
        component={DetailsCategories}
        options={{
          title: 'Details Categories',
        }}
      />

      {/*---------------- ORDERS ----------------*/}
      <HomeStack.Screen
        name="OrdersScreen"
        component={OrdersScreen}
        options={{
          title: 'Comenziile mele',
          headerStyle: {
            backgroundColor: colors.backgroundButtonActive,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
      />
      {/* --------- ORDER ITEMS ---------- */}
      <HomeStack.Screen
        name="OrderItemsScreen"
        component={OrderItemsScreen}
        options={{
          title: 'Produsele mele',
          headerStyle: {
            backgroundColor: colors.backgroundButtonActive,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
      />
    </HomeStack.Navigator>
  );

  const ProfileStackScreen = () => (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profil',
          headerStyle: {
            backgroundColor: colors.backgroundButtonActive,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
      />
      <ProfileStack.Screen
        name="PayDeskScreen"
        component={PayDesk}
        options={{
          title: 'Datele pentru plata',
          headerStyle: {
            backgroundColor: colors.backgroundButtonActive,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
      />
      <ProfileStack.Screen
        name="CheckoutPaymentScreen"
        component={CheckoutPayment}
        options={{
          title: 'Confirmare plata',
          headerStyle: {
            backgroundColor: colors.backgroundButtonActive,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
      />
      <ProfileStack.Screen
        name="CouponsListScreen"
        component={CouponsList}
        options={{
          title: 'Lista de cupoane',
          headerStyle: {
            backgroundColor: colors.backgroundButtonActive,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
      />
    </ProfileStack.Navigator>
  );

  const CartStackScreen = () => (
    <CartStack.Navigator>
      <CartStack.Screen
        name="Cart"
        component={Cart}
        options={{
          title: 'Cos de cumparaturi',
          headerStyle: {
            backgroundColor: colors.backgroundButtonActive,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
      />
      <CartStack.Screen
        name="CouponsListScreen"
        component={CouponsList}
        options={{
          title: 'Lista de cupoane',
          headerStyle: {
            backgroundColor: colors.backgroundButtonActive,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
      />
      <CartStack.Screen
        name="PayDeskScreen"
        component={PayDesk}
        options={{
          title: 'Datele pentru plata',
          headerStyle: {
            backgroundColor: colors.backgroundButtonActive,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
      />
    </CartStack.Navigator>
  );

  //AppBottomTabs
  const AppBottomTabs = () => (
    <UserContext.Provider value={[userDataLogin, setUserDataLogin]}>
      <AppBottomTab.Navigator
        screenOptions={{
          tabBarStyle: {
            position: 'absolute',
            height: 52,
            backgroundColor: colors.backgroundApp,
          },
          headerShown: false,
        }}>
        {/* HOME STACK SCREEN */}
        <AppBottomTab.Screen
          name="HomeStackScreen"
          component={HomeStackScreen}
          options={{
            headerStyle: {
              // backgroundColor:colors.default.backgroundBottomInactive
            },
            tabBarOptions: {
              activeTintColor: colors.backgroundButtonActive,
              style: {
                borderTopWidth: 0,
                width: '100%',
                borderTopLeftRadius: 10,
                backgroundColor: '#fff',
              },
            },
            tabBarLabel: 'Acasa',
            tabBarLabelStyle: {fontSize: 14},
            tabBarItemStyle: {borderTopLeftRadius: 16},
            tabBarInactiveTintColor: colors.colorBottomInactiveText,
            tabBarInactiveBackgroundColor: colors.backgroundBottomTabInactive,
            tabBarActiveTintColor: colors.white,
            tabBarActiveBackgroundColor: colors.backgroundButtonActive,
            title: 'Home',
            tabBarIcon: ({color}) => (
              <Icon name={'home'} type="font-awesome" color={color} />
            ),
          }}
        />
        {/* CART SCREEN */}
        <AppBottomTab.Screen
          name="CartScreen"
          component={CartStackScreen}
          options={{
            headerStyle: {
              // backgroundColor:colors.default.backgroundBottomInactive
            },

            tabBarLabel: 'Cos',
            tabBarLabelStyle: {fontSize: 14},
            tabBarInactiveTintColor: colors.colorBottomInactiveText,
            tabBarInactiveBackgroundColor: colors.backgroundBottomTabInactive,
            tabBarActiveTintColor: colors.white,
            tabBarActiveBackgroundColor: colors.backgroundButtonActive,
            title: 'Cart',
            tabBarIcon: ({color}) => (
              <Icon name={'shoppingcart'} type="ant-design" color={color} />
            ),
          }}
        />
        {/* TICKETS SCREEN */}
        <AppBottomTab.Screen
          name="TicketsScreen"
          component={Tickets}
          options={{
            headerStyle: {
              // backgroundColor:colors.default.backgroundBottomInactive
            },

            tabBarLabel: 'Cupoane',
            tabBarLabelStyle: {fontSize: 14},
            tabBarInactiveTintColor: colors.colorBottomInactiveText,
            tabBarInactiveBackgroundColor: colors.backgroundBottomTabInactive,
            tabBarActiveTintColor: colors.white,
            tabBarActiveBackgroundColor: colors.backgroundButtonActive,
            title: 'Tickets',
            tabBarIcon: ({color}) => (
              <Icon name={'ticket'} type="font-awesome" color={color} />
            ),
          }}
        />
        {/* PROFILE SCREEN */}
        <AppBottomTab.Screen
          name="ProfileScreen"
          component={ProfileStackScreen}
          options={{
            headerStyle: {
              // backgroundColor: colors.backgroundButtonActive,
            },
            tabBarItemStyle: {borderTopRightRadius: 16},
            tabBarLabel: 'Profil',
            tabBarLabelStyle: {fontSize: 14},
            tabBarInactiveTintColor: colors.colorBottomInactiveText,
            tabBarInactiveBackgroundColor: colors.backgroundBottomTabInactive,
            tabBarActiveTintColor: colors.white,
            tabBarActiveBackgroundColor: colors.backgroundButtonActive,
            title: 'Profile',
            tabBarIcon: ({color}) => (
              <Icon name={'user'} type="ant-design" color={color} />
            ),
          }}
        />
      </AppBottomTab.Navigator>
    </UserContext.Provider>
  );

  //AuthStackScreen
  const AuthStackScreen = () => (
    <AuthStack.Navigator screenOptions={{headerShown: false}}>
      <AuthStack.Screen
        name="LoginScreen"
        component={Login}
        options={{
          title: 'Login',
        }}
      />
      <AuthStack.Screen
        name="RegisterScreen"
        component={Register}
        options={{
          title: 'Register',
        }}
      />
      <AuthStack.Screen
        name="ConfirmCodeScreen"
        component={ConfirmCode}
        options={{
          title: 'ConfirmCode',
        }}
      />
      <AuthStack.Screen
        name="SendEmailScreen"
        component={SendEmail}
        options={{
          title: 'SendEmailScreen',
        }}
      />
      <AuthStack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPassword}
        options={{
          title: 'ForgotPasswordScreen',
        }}
      />
    </AuthStack.Navigator>
  );

  //RootStackScreen
  const RootStackScreen = ({userToken}) => (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {userToken ? (
        <RootStack.Screen
          name="ComplexFoodApp"
          component={AppBottomTabs}
          options={{
            animationEnabled: false,
          }}
        />
      ) : (
        <RootStack.Screen
          name="Authethicate"
          component={AuthStackScreen}
          options={{
            animationEnabled: false,
          }}
        />
      )}
    </RootStack.Navigator>
  );

  return (
    <AuthContext.Provider value={authContext}>
      <Memoize>
        <NavigationContainer>
          <RootStackScreen userToken={userToken} />
        </NavigationContainer>
      </Memoize>
    </AuthContext.Provider>
  );
}

export default App;
