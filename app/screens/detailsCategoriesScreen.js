import React, {useState, useEffect, useContext} from 'react';
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
import colors from '../../config/colors/colors';
import GestureFlipView from 'react-native-gesture-flip-card';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {color} from 'react-native-reanimated';
import {MenuProductsContext} from '../../config/context';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const menu_container_width = width - 50;

function DetailsCategories({navigation, route}) {
  const [dataMenu, setDataMenu] = useState(route.params.menuDataForCategories);
  const data = route.params.menuDataForCategories;
  const {menuDataInCart, setMenuDataInCart} = useContext(MenuProductsContext);

  const removeFromQuantity = props => {
    console.log(props.quantity);
    if (props.quantity > 0) {
      const newDataMenu = Object.assign({}, dataMenu);
      newDataMenu[props.myIndex].quantity = props.quantity - 1;
      setDataMenu(newDataMenu);
    }
  };
  const addToQuantity = props => {
    if (props.quantity < 20) {
      const newDataMenu = Object.assign({}, dataMenu);
      newDataMenu[props.myIndex].quantity = props.quantity + 1;
      setDataMenu(newDataMenu);
    }
  };

  const addToCard = props => {
    if (props.quantity > 0) {
      let addDetailsMenu = {
        key: dataMenu[props.myIndex].key,
        src: dataMenu[props.myIndex].src,
        title: dataMenu[props.myIndex].title,
        price: dataMenu[props.myIndex].price,
        category: dataMenu[props.myIndex].category,
        details: dataMenu[props.myIndex].details,
        quantity: dataMenu[props.myIndex].quantity + props.quantity,
      };

      setMenuDataInCart(menu => [...menu, addDetailsMenu]);
    }
  };
  // useEffect(() => {}, [menuDataInCart, dataMenu]);

  const renderFront = props => {
    return (
      <View style={[styles.image_container, {backgroundColor: colors.white}]}>
        <Image source={props.src} style={styles.image} resizeMode="cover" />
        <Text
          style={[styles.title_menu, {color: colors.backgroundButtonActive}]}>
          {props.title}
        </Text>
        <Text
          style={[
            styles.price_menu,
            {color: colors.backgroundButtonActive, marginTop: -10},
          ]}>
          {props.price} RON
        </Text>
        <View style={styles.buttonsAddRemoveQuantity}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => removeFromQuantity(props)}>
            <View style={styles.button}>
              <Icon
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => addToQuantity(props)}>
            <View style={styles.button}>
              <Icon
                name="add-circle-outline"
                type="ionicon"
                size={40}
                color={colors.backgroundButtonActive}
              />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => addToCard(props)} activeOpacity={0.8}>
          <View style={styles.buttonForCart}>
            <Text style={styles.buttonText}>Adauga in cos</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBack = props => {
    return (
      <View style={[styles.image_container, {width: menu_container_width}]}>
        <Text style={styles.title_menu}>{props.title}</Text>
        <Text style={styles.price_menu}>{props.price} RON</Text>
        <Text
          style={[styles.details_text, {fontWeight: '700', marginBottom: -10}]}>
          Ingrediente
        </Text>
        <ScrollView>
          <Text style={styles.details_text}>{props.details} </Text>
        </ScrollView>
      </View>
    );
  };

  const MenuItem = props => (
    <GestureFlipView width={menu_container_width} height={510}>
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
      quantity={item.quantity}
      myIndex={index}
    />
  );
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
      <View style={styles.menu_container}>
        <FlatList
          data={data}
          renderItem={renderMenuItem}
          keyExtractor={item => item.key}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.backgroundApp,
  },
  icon: {
    paddingTop: 3,
    paddingRight: width - 50,
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
    height: 320,
    borderRadius: 16,
  },
  title_menu: {
    fontFamily: 'Poppins',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 18,
    color: colors.white,
    fontWeight: 'bold',
  },
  price_menu: {
    fontFamily: 'Poppins',
    marginTop: 12,
    textAlign: 'right',
    fontSize: 16,
    color: colors.white,
    fontWeight: '700',
    paddingRight: 10,
  },
  details_text: {
    paddingVertical: 10,
    fontFamily: 'Poppins',
    margin: 10,
    textAlign: 'left',
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
  },
  button: {
    // marginTop: 10,
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

    elevation: 2,
  },
  buttonForCart: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: 150,
    height: 40,
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
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  quantityLabel: {
    width: 60,
    height: 50,
    borderColor: colors.backgroundButtonActive,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
export default DetailsCategories;
