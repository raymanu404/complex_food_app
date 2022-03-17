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
import {MenuProductsContext} from '../../../config/context';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const menu_container_width = 300;
const enum_categories = {
  SOUP: 'soup',
  MEAT: 'meat',
  GARNISH: 'garnish',
  DESERT: 'desert',
  SALAD: 'salad',
  DRINK: 'drink',
  STANDARD: 'standard',
};

function Home({navigation}) {
  const {menuDataInCart, setMenuDataInCart} = useContext(MenuProductsContext);

  // const addInCart = useCallback(menuItem => {
  //   console.log('teaociabufaj' + menuItem);
  //   setMenuDataInCart(menu => [...menu, menuItem]);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const dataForCart = useMemo(
  //   () => ({menuDataInCart, addInCart}),
  //   [addInCart, menuDataInCart],
  // );

  const [menuData, setMenuData] = useState([
    {
      key: 'augfahgagag2aifgahfpj',
      src: require('../../assets/14.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.STANDARD,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'aafag222222222gagafpj',
      src: require('../../assets/13.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.STANDARD,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'augfahgagafpj',
      src: require('../../assets/17.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.STANDARD,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'augfahgag2pj',
      src: require('../../assets/16.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.STANDARD,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'augfahgafj',
      src: require('../../assets/15.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.DRINK,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'augfahgaga',
      src: require('../../assets/13.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.DRINK,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'augfahhfpj',
      src: require('../../assets/14.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.SOUP,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'heehreherhe',
      src: require('../../assets/16.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.SOUP,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'augghfpj',
      src: require('../../assets/17.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.SOUP,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'aug1fpj',
      src: require('../../assets/19.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.MEAT,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'augf5pj',
      src: require('../../assets/23.jpg'),
      title: 'Salata de beof',
      price: 5.99,
      quantity: 0,
      category: 'salad',
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'aug7pj',
      src: require('../../assets/20.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.MEAT,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'augf6pj',
      src: require('../../assets/3.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.DESERT,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'augf5pj',
      src: require('../../assets/5.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.DESERT,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      key: 'aug2fpj',
      src: require('../../assets/6.jpg'),
      title: 'Cheese Cake',
      price: 5.99,
      quantity: 0,
      category: enum_categories.GARNISH,
      details:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
  ]);

  const [infoToSearch, setInfoToSearch] = useState('');

  const [categoriesData, setCategoriesData] = useState([
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
  ]);

  // useEffect(() => {
  //   console.log(menuDataInCart);
  // });

  const MenuItem = props => (
    <View style={styles.menuContainer}>
      <TouchableHighlight
        underlayColor={colors.white}
        // onPress={() => vasi()}
        onPress={() => goToDetailsStandard(props)}>
        <Image
          source={props.src}
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
        src={item.src}
        price={item.price}
        details={item.details}
        category={item.category}
        quantity={item.quantity}
        mykey={item.key}
      />
    );
  };

  const vasi = () => {
    setMenuDataInCart(menu => [
      ...menu,
      {
        key: 'he21414',
        src: require('../../assets/16.jpg'),
        title: 'Cheese Cake',
        price: 5.99,
        quantity: 0,
        category: enum_categories.STANDARD,
        details: 'Lorem.',
      },
    ]);
  };
  console.log(menuDataInCart);
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
    />
  );

  const goToDetailsCategories = props => {
    let menuDataForCategories = menuData.filter(
      item => item.category === props.type,
    );

    // console.log(menuDataForCategories);
    navigation.navigate('DetailsCategoriesScreen', {
      menuDataForCategories: menuDataForCategories,
    });
  };
  const goToDetailsStandard = props => {
    navigation.navigate('DetailsStandardScreen', {
      title: props.title,
      price: props.price,
      src: props.src,
      details: props.details,
      category: props.category,
      quantity: props.quantity,
      key: props.mykey,
    });
  };

  const searchBarHandler = val => {
    setInfoToSearch(val);
  };

  const onSearchBarButton = () => {
    if (String(infoToSearch) !== '') {
      console.log('search bar');
    }
  };

  return (
    // <MenuProductsContext.Provider value={[menuDataInCart, setMenuDataInCart]}>
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.container}>
        {/* ------------------------------------HEADER---------------------------- */}
        <View style={styles.header}>
          <Text style={styles.textSuggest}>Meniu</Text>
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
          <Text
            style={[
              styles.textSuggest,
              {color: colors.blackGrey, left: width - 540, marginBottom: 5},
            ]}>
            Meniuri Standard
          </Text>
          <FlatList
            horizontal={true}
            data={menuData.filter(
              el => el.category === enum_categories.STANDARD,
            )}
            keyExtractor={item => item.key}
            renderItem={renderMenuItem}
          />
          <View style={styles.categories}>
            <Text
              style={[
                styles.textSuggest,
                {color: colors.blackGrey, left: width - 560},
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
        </View>
      </View>
    </TouchableWithoutFeedback>
    // </MenuProductsContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundApp,
  },
  header: {
    // flex: 0.2,
    paddingTop: 20,
    // justifyContent: 'flex-start',
    alignItems: 'center',
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
    marginTop: height - 800,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  menuContainer: {
    marginLeft: 30,
    marginRight: 10,
    right: 30,
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
  menu_standard_image: {
    width: menu_container_width,
    height: 280,
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
    marginTop: 12,
    textAlign: 'right',
    fontSize: 16,
    color: colors.backgroundButtonActive,
    fontWeight: '700',
    paddingRight: 10,
  },
  categories: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: -height + 700,
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
});

export default Home;
