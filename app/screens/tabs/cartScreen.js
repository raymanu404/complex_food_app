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
} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import GestureFlipView from 'react-native-gesture-flip-card';
import colors from '../../../config/colors/colors';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {MenuProductsContext} from '../../../config/context';

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

function Cart() {
  const {menuDataInCart, setMenuDataInCart} = useContext(MenuProductsContext);
  // const [dataFromCart, setDataFromCart] = useState(menuDataInCart);

  // const [dataFromCart, setDataFromCart] = useState([
  //   {
  //     key: 'augfahgagag2aifgahfpj',
  //     src: require('../../assets/14.jpg'),
  //     title: 'Cheese Cake',
  //     price: 5.99,
  //     quantity: 2,
  //     category: enum_categories.STANDARD,
  //     details:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  //   {
  //     key: 'aafag222222222gagafpj',
  //     src: require('../../assets/13.jpg'),
  //     title: 'Cheese Cake',
  //     price: 5.99,
  //     quantity: 2,
  //     category: enum_categories.STANDARD,
  //     details:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  //   {
  //     key: 'augfahgagafpj',
  //     src: require('../../assets/17.jpg'),
  //     title: 'Cheese Cake',
  //     price: 5.99,
  //     quantity: 2,
  //     category: enum_categories.STANDARD,
  //     details:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  //   {
  //     key: 'augfahgag2pj',
  //     src: require('../../assets/16.jpg'),
  //     title: 'Cheese Cake',
  //     price: 5.99,
  //     quantity: 2,
  //     category: enum_categories.STANDARD,
  //     details:
  //       "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  //   },
  // ]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    console.log(menuDataInCart);
    if (menuDataInCart.length !== 0) {
      computeTotalOfPrice();
    }
  });

  //Calculate total of price HERE
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const computeTotalOfPrice = () => {
    let sum = 0.0;
    menuDataInCart.map(element => {
      sum += element.price * element.quantity;
    });
    setTotalPrice(sum.toFixed(2));
  };

  /*
  obj.arr = obj.arr.filter((value, index, self) =>
  index === self.findIndex((t) => (
    t.place === value.place && t.name === value.name
  ))
)
  */
  const concateSameItems = props => {
    const uniqueElements = new Set(menuDataInCart);
    const filteredElements = menuDataInCart.filter(item => {
      if (uniqueElements.has(item)) {
        uniqueElements.delete(item);
      } else {
        return item;
      }
    });
  };

  //Remove item from cart
  const removeItemFromCart = props => {
    setMenuDataInCart(myNewMenu =>
      myNewMenu.filter(el => el.key !== props.myKey),
    );
  };

  const renderFront = props => {
    return (
      <View style={[styles.image_container, {backgroundColor: colors.white}]}>
        <Image source={props.src} style={styles.image} resizeMode="cover" />
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
          <Text
            style={[styles.price_menu, {color: colors.backgroundButtonActive}]}>
            Cantitate: {props.quantity}
          </Text>
          <Text
            style={[styles.price_menu, {color: colors.backgroundButtonActive}]}>
            {props.price * props.quantity} RON
          </Text>
          <TouchableOpacity
            style={styles.icon_trash}
            activeOpacity={0.6}
            onPress={() => removeItemFromCart(props)}>
            <Icon
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
          Ingrediente
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
      src={item.src}
      title={item.title}
      price={item.price}
      details={item.details}
      myKey={item.key}
      quantity={item.quantity}
    />
  );

  return (
    <View style={styles.container}>
      {menuDataInCart.length !== 0 ? (
        <View style={styles.menu_container}>
          <FlatList
            renderItem={renderMenuItem}
            keyExtractor={item => item.key}
            data={menuDataInCart}
          />
          <View style={styles.payment_container}>
            <View style={styles.payment_view}>
              <TouchableOpacity
                onPress={() => console.log()}
                activeOpacity={0.8}>
                <View style={styles.button}>
                  <Text style={styles.buttonText}>Aplica Cupon</Text>
                </View>
              </TouchableOpacity>

              <View
                style={[
                  styles.button,
                  {backgroundColor: colors.white, width: 200},
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
            <TouchableOpacity onPress={() => console.log()} activeOpacity={0.8}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Plateste</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Animatable.View
          style={styles.cart_empty_container}
          animation={'pulse'}
          duration={800}>
          <Image
            resizeMode="contain"
            source={require('../../assets/empty_cart-removebkg.png')}
            style={styles.image}
          />
          <Text style={styles.title_menu}>Cosul este gol!</Text>
        </Animatable.View>
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
    fontFamily: 'Poppins',
    fontSize: 18,
    textAlign: 'center',
    color: colors.blackGrey,
    fontWeight: '700',
  },
  price_menu: {
    fontFamily: 'Poppins',
    textAlign: 'center',
    fontSize: 17,
    color: colors.white,
    paddingRight: 10,
    fontWeight: '700',
  },
  details_text: {
    paddingVertical: 10,
    paddingBottom: 10,
    fontFamily: 'Poppins',
    margin: 10,
    textAlign: 'left',
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 150,
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
    // flex: 1,
    marginTop: 10,
    alignItems: 'center',
  },
  payment_view: {
    paddingBottom: 20,
    width: menu_container_width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
});

export default Cart;
