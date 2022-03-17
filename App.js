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
import DetailsCategories from './app/screens/detailsCategoriesScreen';
import DetailsStandard from './app/screens/detailsStandardScreen';

//tabs
import Home from './app/screens/tabs/homeScreen';
import Cart from './app/screens/tabs/cartScreen';
import Tickets from './app/screens/tabs/ticketsScreen';
import Profile from './app/screens/tabs/profileScreen';
import PayDesk from './app/components/Paydesk';
import colors from './config/colors/colors';
import {AuthContext, MenuProductsContext} from './config/context';
import {Memoize} from './config/Memoize';

const RootStack = createStackNavigator();
const AuthStack = createStackNavigator();
const AppBottomTab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

function App() {
  const [userToken, setUserToken] = useState('null');
  const [isLoading, setIsLoading] = useState(true);
  const [menuDataInCart, setMenuDataInCart] = useState([]);

  const authContext = useMemo(() => {
    return {
      login: props => {
        setIsLoading(false);
        setUserToken('la fel ceva token aici ');
      },
      register: () => {
        setIsLoading(false);
        setUserToken('ceva token aici');
      },
      logout: () => {
        setIsLoading(false);
        setUserToken(null);
      },
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
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
    </ProfileStack.Navigator>
  );
  //AppBottomTabs
  const AppBottomTabs = () => (
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
        component={Cart}
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
      <MenuProductsContext.Provider value={{menuDataInCart, setMenuDataInCart}}>
        <Memoize>
          <NavigationContainer>
            <RootStackScreen userToken={userToken} />
          </NavigationContainer>
        </Memoize>
      </MenuProductsContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
