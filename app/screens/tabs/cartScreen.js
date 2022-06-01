import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableHighlight,
  ToastAndroid,
  Alert,
} from 'react-native';
import GestureFlipView from 'react-native-gesture-flip-card';
import colors from '../../../config/colors/colors';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {Icon} from 'react-native-elements';
import {UserContext} from '../../../App';
import RenderEmptyList from '../../components/RenderEmptyList';
import ConfirmedOrder from '../../components/ConfirmedOrder';
import api_axios from '../../../config/api/api_axios';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const menu_container_width = width - 50;

const enum_categories = {
  SOUP: 'soup',
  MEAT: 'meat',
  GARNISH: 'garnish',
  DESERT: 'desert',
  SALAD: 'salad',
  DRINK: 'drink',
  STANDARD: 'standard',
};

function Cart({navigation}) {
  // const [menuDataInCart, setMenuDataInCart] = useContext(UserContext);
  const [menuDataInCart, setMenuDataInCart] = useState([]);
  const [userDataLogin, setUserDataLogin] = useContext(UserContext);
  const buyerID = userDataLogin.id || 1;
  const cartID = userDataLogin.cartId;
  const [couponCode, setCouponCode] = useState('default');
  const [totalPrice, setTotalPrice] = useState(0);
  const [confirmCart, setConfirmCart] = useState({
    confirmed: false,
    orderCode: '',
  });

  useEffect(() => {
    const getDataFromCart = async () => {
      try {
        let headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };
        const response = await api_axios.get(
          `/shoppingItems/get_items/${buyerID}`,
          headers,
        );
        const itemsFromApi = response.data;
        if (response.status === 200) {
          let sum = 0.0;
          itemsFromApi.map(element => {
            sum += element.price * element.cantity;
          });

          setMenuDataInCart(response.data);
          setConfirmCart({
            ...confirmCart,
            confirmed: false,
          });
          setTotalPrice(sum.toFixed(2));
        }
      } catch (error) {
        console.log(error.response.status);
      }
    };

    getDataFromCart();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFromQuantity = props => {
    console.log(props.quantity);
    if (props.quantity > 0) {
      const newDataMenu = Object.assign({}, menuDataInCart);
      newDataMenu[props.myKey].quantity = props.quantity - 1;
      setMenuDataInCart(newDataMenu);
      let newTotalPrice =
        totalPrice -
        Number(newDataMenu[props.myKey].quantity) *
          Number(newDataMenu[props.myKey].price);
      setTotalPrice(newTotalPrice);
    }
  };

  const addToQuantity = props => {
    const newDataMenu = Object.assign({}, menuDataInCart);
    for (var i in newDataMenu) {
      if (newDataMenu[i].id === props.myKey) {
        console.log(newDataMenu[i]);
        console.log(props);
        newDataMenu[i].cantity = props.quantity + 1;

        // let newTotalPrice =
        //   totalPrice -
        //   Number(newDataMenu[i].quantity) * Number(newDataMenu[i].price);
        // setTotalPrice(newTotalPrice);
      }
    }
  };

  //Remove item from cart
  const removeItemFromCart = async props => {
    console.log(props);

    try {
      let headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      };
      let itemToDelete = {
        productId: props.myKey,
        cantity: 0,
      };
      const reponseDeleteItem = await api_axios.post(
        `/shoppingItems/create/${buyerID}`,
        itemToDelete,
        headers,
      );
      if (
        reponseDeleteItem.status === 200 &&
        reponseDeleteItem.data === 'Item was deleted successesfully!'
      ) {
        setMenuDataInCart(myNewMenu =>
          myNewMenu.filter(el => el.id !== props.myKey),
        );
        let newTotalPrice =
          totalPrice - Number(props.price) * Number(props.quantity);
        setTotalPrice(newTotalPrice);
      }
    } catch (error) {
      console.log(error.response.status);
    }
  };

  const renderFront = props => {
    return (
      <View style={[styles.image_container, {backgroundColor: colors.white}]}>
        <Image
          source={{uri: props.src}}
          style={styles.image}
          resizeMode="cover"
        />
        <Text
          style={[styles.title_menu, {color: colors.backgroundButtonActive}]}>
          {props.title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: -10,
          }}>
          {/* <View style={styles.buttonsAddRemoveQuantity}>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.buttonAddRemove}>
                <Icon
                  onPress={() => removeFromQuantity(props)}
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
                  {
                    color: colors.backgroundButtonActive,
                    fontSize: 28,
                  },
                ]}>
                {props.quantity}{' '}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.buttonAddRemove}>
                <Icon
                  onPress={() => addToQuantity(props)}
                  name="add-circle-outline"
                  type="ionicon"
                  size={40}
                  color={colors.backgroundButtonActive}
                />
              </View>
            </TouchableOpacity>
          </View> */}
          <Text
            style={[styles.price_menu, {color: colors.backgroundButtonActive}]}>
            Cantitate: {props.quantity}
          </Text>
          <Text
            style={[styles.price_menu, {color: colors.backgroundButtonActive}]}>
            {props.price * props.quantity} RON
          </Text>
          <TouchableOpacity style={styles.icon_trash} activeOpacity={0.6}>
            <Icon
              onPress={() => removeItemFromCart(props)}
              name={'trash-bin-outline'}
              type={'ionicon'}
              size={32}
              color={colors.recycleBin}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBack = props => {
    return (
      <View style={[styles.image_container, {width: menu_container_width}]}>
        <Text style={[styles.title_menu, {color: colors.white}]}>
          {props.title}
        </Text>
        <Text style={[styles.price_menu, {textAlign: 'right'}]}>
          {props.price} RON
        </Text>
        <Text
          style={[styles.details_text, {fontWeight: '700', marginBottom: -10}]}>
          Detalii Produs
        </Text>
        <ScrollView style={{flex: 1}}>
          <Text style={styles.details_text}>{props.details} </Text>
        </ScrollView>
      </View>
    );
  };

  const MenuItem = props => (
    <GestureFlipView width={menu_container_width} height={440}>
      {renderFront(props)}
      {renderBack(props)}
    </GestureFlipView>
  );

  const renderMenuItem = ({item, index}) => (
    <MenuItem
      src={item.image}
      title={item.title}
      price={item.price}
      details={item.description}
      myKey={item.id}
      quantity={item.cantity}
      dateCreate={item.dateCreated}
    />
  );

  const setCodeCouponHandler = code => {
    setCouponCode(code);
  };
  const applyUserCouponHandler = () => {
    if (totalPrice >= 12) {
      navigation.navigate('CouponsListScreen', {
        buyerID: buyerID,
        onGoBack: setCodeCouponHandler,
      });
    } else {
      Alert.alert(
        'Comanda minima',
        'Comanda minima pentru aplicarea cupoanelor este de 12 RON!',
      );
    }
  };
  const showToastWithGravity = message => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const deleteCartHandler = async () => {
    try {
      let headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      };

      const response = await api_axios.delete(
        `/carts/delete/${buyerID}`,
        headers,
      );
      console.log(response.data);
      const responseMessage = response.data;
      if (String(responseMessage) === 'Success!') {
        showToastWithGravity('Cosul a fost sters cu succes!');
        setMenuDataInCart([]);
      }
    } catch (error) {
      console.log(error.response.status);
      showToastWithGravity('Cosul nu a fost gasit!');
    }
  };

  const checkoutBalanceRedirectOnPaymentScreen = balance => {
    if (balance >= totalPrice) {
      return true;
    } else {
      let userInfoObj = {
        buyerId: buyerID,
        email: userDataLogin.email,
        firstName: userDataLogin.firstName,
        lastName: userDataLogin.lastName,
        phoneNumber: userDataLogin.phoneNumber,
      };
      navigation.navigate('PayDeskScreen', {
        userInfo: userInfoObj,
      });
    }
  };

  const confirmCommandHandler = async () => {
    try {
      let headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      };
      if (checkoutBalanceRedirectOnPaymentScreen(userDataLogin.balance)) {
        let couponCodeFromBuyer = {
          couponCart: couponCode,
        };

        const response = await api_axios.patch(
          `/carts/confirm/${buyerID}`,
          couponCodeFromBuyer,
          headers,
        );
        console.log(response.data);
        const orderCodeFromResponse = response.data;
        if (String(orderCodeFromResponse).startsWith('OrderCode')) {
          const orderCode = String(orderCodeFromResponse).split(':')[1];
          showToastWithGravity('Comanda a fost plasata!');
          setMenuDataInCart([]);
          setConfirmCart({
            ...confirmCart,
            confirmed: true,
            orderCode: orderCode,
          });
        }
        // navigation.goBack();
      }
    } catch (error) {
      console.log(error.response.status);
    }
  };
  return (
    <View style={styles.container}>
      {menuDataInCart.length !== 0 ? (
        <View style={styles.menu_container}>
          <FlatList
            renderItem={renderMenuItem}
            keyExtractor={item => item.id}
            data={menuDataInCart}
          />
          <View style={styles.payment_container}>
            <View style={styles.payment_view}>
              <View style={styles.couponContainer}>
                <TouchableOpacity activeOpacity={0.8}>
                  <View style={styles.button}>
                    <Text
                      style={styles.buttonText}
                      onPress={applyUserCouponHandler}>
                      Aplica Cupon
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.textCouponCode}>
                  {couponCode === 'default'
                    ? ''
                    : String(`Cod cupon: ${couponCode}`)}
                </Text>
              </View>

              <View
                style={[
                  styles.button,
                  {backgroundColor: colors.white, width: 160, marginBottom: 30},
                ]}>
                <Text
                  style={[
                    styles.buttonText,
                    {color: colors.black, fontSize: 16},
                  ]}>
                  Total: {totalPrice} RON
                </Text>
              </View>
            </View>

            <View style={styles.deleteCartIcon}>
              <Text style={styles.textDeleteCart}>Golire cos</Text>
              <Icon
                onPress={() => deleteCartHandler()}
                name={'cart-remove'}
                type={'material-community'}
                size={32}
                color={colors.recycleBin}
              />
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.button}>
                <Text
                  style={styles.buttonText}
                  onPress={() => confirmCommandHandler()}>
                  Plateste
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : confirmCart.confirmed ? (
        <ConfirmedOrder
          title_message="Multumim pentru comanda!"
          orderCode={confirmCart.orderCode}
        />
      ) : (
        <RenderEmptyList title_message={'Cosul este gol!'} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundApp,
  },
  icon_trash: {
    display: 'flex',
    // left: menu_container_width - 210,
    marginTop: -3,
  },
  cart_empty_container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: menu_container_width,
    height: 320,
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  menu_container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 60,
  },
  image_container: {
    marginTop: 20,
    flex: 1,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 3,
    marginBottom: 10,
    backgroundColor: colors.backgroundButtonActive,
  },
  image: {
    width: menu_container_width,
    height: 300,
    borderRadius: 16,
  },
  title_menu: {
    paddingBottom: 25,
    paddingVertical: 8,
    fontSize: 18,
    textAlign: 'center',
    color: colors.blackGrey,
    fontWeight: '700',
  },
  price_menu: {
    textAlign: 'center',
    fontSize: 17,
    color: colors.white,
    paddingRight: 10,
    fontWeight: '700',
  },
  details_text: {
    paddingVertical: 10,
    paddingBottom: 10,
    margin: 10,
    textAlign: 'left',
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 140,
    height: 40,
    marginBottom: 10,
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
  payment_container: {
    paddingTop: 2,
    alignItems: 'center',
  },
  payment_view: {
    paddingBottom: 20,
    width: menu_container_width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  deleteCartIcon: {
    flexDirection: 'row',
    marginTop: -10,
    width: 100,
    marginLeft: width * 0.65,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  textDeleteCart: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.recycleBin,
    letterSpacing: 1,
  },
  couponContainer: {
    // marginTop: 20,
    flexDirection: 'column',
  },
  textCouponCode: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.backgroundButtonActive,
    fontWeight: '500',
    paddingLeft: 5,
  },
  buttonsAddRemoveQuantity: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  quantityLabel: {
    // width: 60,
    // height: 50,
    // borderColor: colors.backgroundButtonActive,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
  },
  buttonAddRemove: {
    marginBottom: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
});

export default Cart;
