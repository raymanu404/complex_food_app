import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useContext,
} from 'react';
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
  FlatList,
} from 'react-native';
import colors from '../../../config/colors/colors';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import {MenuProductsContext, UserContext} from '../../../App';
import api_axios from '../../../config/api/api_axios';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const menu_container_width = 300;
const enum_categories = {
  SOUP: 1,
  MEAT: 2,
  GARNISH: 3,
  DESERT: 4,
  SALAD: 5,
  DRINK: 6,
  STANDARD: 7,
};

const defaultMenusData = [
  {
    id: '3',
    image:
      'https://blobcontainercomplexfood.blob.core.windows.net/complexfoodcontainer1/15.jpg',
    title: 'Cheese Cake',
    price: 5.99,
    quantity: 0,
    category: enum_categories.STANDARD,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: '1',
    image:
      'https://blobcontainercomplexfood.blob.core.windows.net/complexfoodcontainer1/15.jpg',
    title: 'Cheese Cake',
    price: 5.99,
    quantity: 0,
    category: enum_categories.STANDARD,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
  {
    id: '2',
    image:
      'https://blobcontainercomplexfood.blob.core.windows.net/complexfoodcontainer1/15.jpg',
    title: 'Cheese Cake',
    price: 5.99,
    quantity: 0,
    category: enum_categories.SOUP,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
];

const categoriesData = [
  {
    key: '1fbaijoga',
    type: enum_categories.SOUP,
    title: 'Supe/Ciorbe',
    src: require('../../assets/soup.png'),
  },
  {
    key: '1f2oga',
    type: enum_categories.MEAT,
    title: 'Preparate carne',
    src: require('../../assets/meat.png'),
  },
  {
    key: '1fbfa',
    type: enum_categories.GARNISH,
    title: 'Garnituri',
    src: require('../../assets/garnish.png'),
  },
  {
    key: '1f4oga',
    type: enum_categories.DESERT,
    title: 'Desert',
    src: require('../../assets/desert.png'),
  },
  {
    key: '1fb2ga',
    type: enum_categories.SALAD,
    title: 'Salate',
    src: require('../../assets/salad.png'),
  },
  {
    key: '1f1a',
    type: enum_categories.DRINK,
    title: 'Bauturi',
    src: require('../../assets/drink.png'),
  },
];

function Home({navigation}) {
  // const {menuDataInCart, setMenuDataInCart} = useContext(MenuProductsContext);
  const [userDataLogin, setUserDataLogin] = useContext(UserContext);
  const buyerId = userDataLogin.id || 1;
  const [menuData, setMenuData] = useState([]);
  const [infoToSearch, setInfoToSearch] = useState('');

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const ac = new AbortController();
    const getProducts = async () => {
      try {
        let headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };

        const response = await api_axios.get('/products', headers);
        setMenuData(response.data);
      } catch (error) {
        console.log(error.response.status);
      }
    };

    getProducts();
    // return () => {
    //   ac.abort();
    //   setMenuData([]);

    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const MenuItem = props => (
    <View style={styles.menuContainer}>
      <TouchableHighlight
        underlayColor={colors.white}
        onPress={() => goToDetailsStandard(props)}>
        <Image
          source={{uri: props.image}}
          style={styles.menu_standard_image}
          resizeMode="cover"
        />
      </TouchableHighlight>
      <Text style={styles.title_menu}>{props.title} </Text>
      <Text style={styles.price_menu}>{props.price} RON</Text>
    </View>
  );

  const renderMenuItem = ({item, index}) => {
    return (
      <MenuItem
        title={item.title}
        image={item.image}
        price={item.price}
        details={item.description}
        category={item.category}
        quantity={0}
        mykey={item.id}
        userId={userDataLogin.id || 8}
      />
    );
  };

  const Categories = props => (
    <View style={styles.categories_container}>
      <TouchableOpacity
        onPress={() => goToDetailsCategories(props)}
        style={{marginTop: 3}}>
        <Image source={props.src} style={styles.category_image} />
      </TouchableOpacity>
      <Text style={[styles.title_menu, {fontSize: 12, fontWeight: '500'}]}>
        {props.title}
      </Text>
    </View>
  );

  const renderCategoryItem = ({item, index}) => (
    <Categories
      title={item.title}
      src={item.src}
      price={item.price}
      details={item.details}
      category={item.category}
      quantity={item.quantity}
      mykey={item.key}
      type={item.type}
      userId={userDataLogin.id || 8}
    />
  );

  const getCartIdFromShoppingHandler = CARTID => {
    console.log(CARTID);
    setUserDataLogin({
      ...userDataLogin,
      cartId: CARTID,
    });
  };

  const goToDetailsCategories = props => {
    let menuDataForCategories =
      menuData.length !== 0
        ? menuData.filter(
            item => item.category === props.type && item.isInStock === true,
          )
        : defaultMenusData.filter(item => item.category === props.type);

    let dataCategories = menuDataForCategories.map(function (row) {
      return {
        title: row.title,
        src: row.image,
        price: row.price,
        details: row.description,
        category: row.category,
        key: row.id,
        buyerId: props.userId,
        quantity: 0,
      };
    });
    navigation.navigate('DetailsCategoriesScreen', {
      menuDataForCategories: dataCategories,
      // onGoBack: getCartIdFromShoppingHandler,
    });
  };
  const goToDetailsStandard = props => {
    let menuStandardObj = {
      title: props.title,
      price: props.price,
      src: props.image,
      details: props.details,
      category: props.category,
      quantity: props.quantity,
      key: props.mykey,
      userId: props.userId,
    };
    navigation.navigate('DetailsStandardScreen', {
      menuStandardObj: menuStandardObj,
      // onGoBack: getCartIdFromShoppingHandler,
    });
  };

  const searchBarHandler = val => {
    setInfoToSearch(val);
  };

  const onSearchBarButton = () => {
    if (String(infoToSearch) !== '') {
      console.log('search bar');
      //cu api
    }
  };

  const goToOrdersHandler = () => {
    navigation.navigate('OrdersScreen', {
      buyerId: buyerId,
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.container}>
        {/* ------------------------------------HEADER---------------------------- */}
        <View style={styles.header}>
          {/* <Text style={styles.textSuggest}>Meniu</Text> */}
          {/* --------------------------------- SEARCH BAR ------------------------------ */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              placeholder="Cauta mancarea preferata!"
              value={infoToSearch}
              onChangeText={val => searchBarHandler(val)}
              placeholderTextColor={colors.backgroundButtonActive}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => onSearchBarButton()}>
              <Icon
                name={'search'}
                type="feather"
                color={colors.backgroundButtonActive}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* --------------------------------FOOTER ---------------------------------- */}
        <View style={styles.footer}>
          {/* ------------------- STANDARD MENUS ------------------- */}
          <View style={styles.menuStandardContainer}>
            <Text
              style={[
                styles.textSuggest,
                {
                  color: colors.blackGrey,
                },
              ]}>
              Meniuri Standard
            </Text>
            <FlatList
              horizontal={true}
              data={
                menuData.length !== 0
                  ? menuData.filter(
                      el =>
                        Number(el.category) === enum_categories.STANDARD &&
                        el.isInStock === true,
                    )
                  : defaultMenusData.filter(
                      el => Number(el.category) === enum_categories.STANDARD,
                    )
              }
              keyExtractor={item => item.id}
              renderItem={renderMenuItem}
            />
          </View>

          {/* ------------------- CATEGORIES ------------------- */}
          <View style={styles.categories}>
            <Text
              style={[
                styles.textSuggest,
                {color: colors.blackGrey, right: width - width * 0.6},
              ]}>
              Categorii
            </Text>
            <FlatList
              horizontal={true}
              data={categoriesData}
              keyExtractor={item => item.key}
              renderItem={renderCategoryItem}
            />
          </View>

          {/* ------------------- ORDERS ------------------- */}
          <View style={styles.ordersContainer}>
            <Text
              style={[
                styles.textSuggest,
                {color: colors.blackGrey, marginLeft: 10},
              ]}>
              Comenziile mele
            </Text>
            <Animatable.View
              animation={'pulse'}
              duration={800}
              style={styles.orderBackground}>
              <Icon
                style={styles.ordersItem}
                onPress={() => goToOrdersHandler()}
                name={'isv'}
                type={'ant-design'}
                size={32}
                color={colors.white}
              />
            </Animatable.View>
          </View>
          {/* End footer */}
        </View>

        {/* End container */}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: colors.backgroundApp,
  },
  header: {
    paddingTop: 10,
    alignItems: 'center',
  },
  menuStandardContainer: {
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 5,
    height: height * 0.5,
  },
  menuContainer: {
    marginRight: 10,
    width: menu_container_width,
    height: 360,
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
  searchBar: {
    display: 'flex',
    width: width * 0.9,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    height: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderRadius: 20,
  },
  textInput: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    alignSelf: 'center',
    width: width * 0.6,
    paddingLeft: 20,
    color: 'rgba(47, 134, 166, 1)',
    fontSize: 18,
    height: 44,
    fontWeight: '500',
  },
  icon: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: width * 0.16,
  },
  textSuggest: {
    textAlign: 'left',
    fontSize: 16,
    color: colors.backgroundButtonActive,
    fontWeight: '700',
  },
  footer: {
    marginLeft: 10,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  menu_standard_image: {
    width: menu_container_width,
    height: 300,
    borderRadius: 16,
  },
  title_menu: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 18,
    color: colors.backgroundButtonActive,
    fontWeight: '700',
  },
  price_menu: {
    textAlign: 'right',
    fontSize: 16,
    color: colors.backgroundButtonActive,
    fontWeight: '700',
    paddingRight: 10,
  },
  categories: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 140,
  },
  categories_container: {
    marginTop: 3,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    borderRadius: 16,
    width: 60,
    height: 60,
    backgroundColor: colors.backgroundBottomTabInactive,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  category_image: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ordersContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    width: width,
    height: 80,
    marginTop: -20,
  },
  ordersItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  orderBackground: {
    marginTop: 3,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    borderRadius: 16,
    width: 60,
    height: 60,
    backgroundColor: colors.backgroundButtonActive,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default Home;
