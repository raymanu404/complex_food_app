import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableHighlight,
  ToastAndroid,
} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import colors from '../../../config/colors/colors';
import {MenuProductsContext, UserContext} from '../../../App';
import api_axios from '../../../config/api/api_axios';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const menu_container_width = width - 50;

function DetailsStandard({navigation, route}) {
  // const [menuDataInCart, setMenuDataInCart] = useContext(UserContext);
  const [menuDataInCart, setMenuDataInCart] = useState(
    route.params.menuStandardObj,
  );
  const [quantity, setQuantity] = useState(menuDataInCart.quantity);
  const removeFromQuantity = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  const addToQuantity = () => {
    if (quantity < 20) {
      setQuantity(quantity + 1);
    }
  };
  const showToastWithGravity = message => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const addToCart = async () => {
    try {
      if (quantity !== 0) {
        let addStandardMenu = {
          key: menuDataInCart.key,
          src: menuDataInCart.src,
          title: menuDataInCart.title,
          price: menuDataInCart.price,
          category: menuDataInCart.category,
          details: menuDataInCart.details,
          quantity: menuDataInCart.quantity + quantity,
        };

        // setMenuDataInCart({
        //   ...menuDataInCart,
        //   menuDataInCart: addStandardMenu,
        // });

        const dataToSend = {
          productId: menuDataInCart.key,
          cantity: addStandardMenu.quantity,
        };
        console.log(dataToSend);
        let headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };
        const response = await api_axios.post(
          `/shoppingItems/create/${menuDataInCart.userId}`,
          dataToSend,
          headers,
        );
        console.log(response.data);
        if (response.status === 201 || response.status === 200) {
          showToastWithGravity('Produs adaugat in cos!');
          route.params.onGoBack(response.data);
          // navigation.goBack();
        }
      }
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 400) {
        showToastWithGravity('Fonduri insuficiente!');
      }
    }
  };
  // useEffect(() => {
  //   return () => {
  //     menuDataInCart;
  //   };
  // }, [menuDataInCart]);
  return (
    <View style={styles.container}>
      <View style={{position: 'absolute', top: 5, left: 5}}>
        <Icon
          name="arrowleft"
          type="ant-design"
          style={styles.icon}
          size={26}
          onPress={() => navigation.goBack()}
        />
      </View>
      <ScrollView style={{flex: 1}}>
        <Animatable.View
          style={styles.image_container}
          animation={'bounceIn'}
          duration={800}>
          <Image
            source={menuDataInCart.src}
            style={styles.image}
            resizeMode="cover"
          />
        </Animatable.View>
        <View
          style={[
            styles.image_container,
            {width: menu_container_width, marginBottom: 80},
          ]}>
          <Text style={styles.title_menu}>{menuDataInCart.title}</Text>
          <Text style={styles.price_menu}>{menuDataInCart.price} RON</Text>
          <Text
            style={[
              styles.details_text,
              {fontWeight: '700', marginBottom: -10},
            ]}>
            Ingrediente
          </Text>
          <Text style={styles.details_text}>{menuDataInCart.details} </Text>
          <View style={styles.buttonsAddRemoveQuantity}>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.button}>
                <Icon
                  onPress={() => removeFromQuantity()}
                  name="remove-circle-outline"
                  type="ionicon"
                  size={40}
                  color={colors.backgroundButtonActive}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.quantityLabel}>
              <Text
                style={[
                  styles.title_menu,
                  {color: colors.backgroundButtonActive, fontSize: 28},
                ]}>
                {`${quantity}`}{' '}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.button}>
                <Icon
                  onPress={() => addToQuantity()}
                  name="add-circle-outline"
                  type="ionicon"
                  size={40}
                  color={colors.backgroundButtonActive}
                />
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={() => addToCart()}>
            <View style={styles.buttonForCart}>
              <Text style={styles.buttonText}>Adauga in cos</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.backgroundApp,
  },
  icon: {
    paddingTop: 3,
    paddingRight: width - 50,
  },
  image_container: {
    flex: 1,
    marginTop: 15,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    backgroundColor: colors.white,
  },
  image: {
    width: menu_container_width,
    height: 400,
    borderRadius: 16,
  },
  title_menu: {
    fontFamily: 'Poppins',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 18,
    color: colors.black,
    fontWeight: '700',
  },
  price_menu: {
    fontFamily: 'Poppins',
    marginTop: 12,
    textAlign: 'right',
    fontSize: 16,
    color: colors.black,
    fontWeight: '700',
    paddingRight: 10,
  },
  details_text: {
    fontFamily: 'Poppins',
    margin: 10,
    textAlign: 'left',
    fontSize: 18,
    color: colors.black,
    fontWeight: '500',
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.white,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  quantityLabel: {
    width: 60,
    height: 50,
    borderColor: colors.backgroundButtonActive,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonForCart: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    width: 150,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(47, 134, 166, 1)',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  buttonsAddRemoveQuantity: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default DetailsStandard;
