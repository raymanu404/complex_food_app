import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  Switch,
} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import api_axios from '../../../config/api/api_axios';
import RenderEmptyList from '../../components/RenderEmptyList';
import Order from '../../components/Order';
import Loading from '../loading';
import colors from '../../../config/colors/colors';
import {RadioButton} from 'react-native-paper';

const windowheight = Dimensions.get('window').height;
const width = Dimensions.get('screen').width;

function OrdersScreen({navigation, route}) {
  const [orders, setOrders] = useState([]);
  const buyerId = route.params.buyerId;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState({
    history: false,
    placed: false,
    withDiscount: false,
    withDiscount10: false,
    withDiscount20: false,
    withDiscount30: false,
    allOrders: false,
  });

  const [sorting, setSorting] = useState({
    typeOfSorting: 'Desc',
  });

  const [filterOrders, setFilterOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        let headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };

        const response = await api_axios.get(`/orders/${buyerId}`, headers);
        let sortOrderDesc = Array.from(response.data).sort(function (a, b) {
          return new Date(b.datePlaced) - new Date(a.datePlaced);
        });

        setOrders(sortOrderDesc);
        setFilterOrders(sortOrderDesc);
      } catch (error) {
        console.log(error.response.status);
      }
      setLoading(false);
    };
    getOrders();
  }, [buyerId]);

  if (loading) {
    return <Loading />;
  }

  const goToOrderItemHandler = (orderId, totalPriceOrder) => {
    navigation.navigate('OrderItemsScreen', {
      orderId: orderId,
      totalPrice: totalPriceOrder,
    });
  };

  const openCloseFiltersModalHandler = () =>
    setIsModalVisible(() => !isModalVisible);

  const renderOrder = ({item, index}) => (
    <Order
      orderId={item.id}
      totalPrice={item.totalPrice}
      datePlaced={item.datePlaced}
      status={item.status}
      discount={item.discount}
      code={item.code}
      goToOrderItems={goToOrderItemHandler}
    />
  );

  // ------------ update list of orders by sorting ---------------
  const updateFilteredOrdersByTypeOfSorting = (typeOfSort, myFilteredList) => {
    switch (typeOfSort) {
      case 'Asc':
        let sortOrderAsc = Array.from(myFilteredList).sort(function (a, b) {
          return new Date(a.datePlaced) - new Date(b.datePlaced);
        });
        setFilterOrders(sortOrderAsc);
        break;
      case 'Desc':
        let sortOrderDesc = Array.from(myFilteredList).sort(function (a, b) {
          return new Date(b.datePlaced) - new Date(a.datePlaced);
        });
        setFilterOrders(sortOrderDesc);
        break;
      default:
        let sortOrderDesc1 = Array.from(myFilteredList).sort(function (a, b) {
          return new Date(b.datePlaced) - new Date(a.datePlaced);
        });
        setFilterOrders(sortOrderDesc1);
        break;
    }
  };

  // ---------------------------------- TOGGLES -----------------------------------------
  //list of orders with orderStatus : done
  const toggleSwitchHistory = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      history: !isSwitchEnabled.history,
      allOrders: false,
    });

    if (!isSwitchEnabled.history) {
      let filterOrdersByOrderStatusDone = Array.from(orders).filter(
        x => x.status === 3,
      );
      updateFilteredOrdersByTypeOfSorting(
        sorting.typeOfSorting,
        filterOrdersByOrderStatusDone,
      );
    }
  };

  //list of orders with orderStatus : placed
  const toggleSwitchPlaced = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      placed: !isSwitchEnabled.placed,
      history: false,
      withDiscount: false,
      withDiscount10: false,
      withDiscount20: false,
      withDiscount30: false,
      allOrders: false,
    });

    if (!isSwitchEnabled.placed) {
      let filterOrdersByOrderStatusPlaced = Array.from(orders).filter(
        x => x.status === 1,
      );
      updateFilteredOrdersByTypeOfSorting(
        sorting.typeOfSorting,
        filterOrdersByOrderStatusPlaced,
      );
    }
  };

  //list of orders with orderStatus : with discount != 0
  const toggleSwitchDiscount = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      withDiscount: !isSwitchEnabled.withDiscount,
      history: false,
      placed: false,
      withDiscount10: false,
      withDiscount20: false,
      withDiscount30: false,
      allOrders: false,
    });

    if (!isSwitchEnabled.withDiscount) {
      let filterOrdersByDiscount = Array.from(orders).filter(
        x => x.discount !== 0,
      );
      updateFilteredOrdersByTypeOfSorting(
        sorting.typeOfSorting,
        filterOrdersByDiscount,
      );
    }
  };

  //list of orders with 10 discount
  const toggleCheckBox10Discount = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      withDiscount10: !isSwitchEnabled.withDiscount10,
      history: false,
      placed: false,
      withDiscount: false,
      withDiscount20: false,
      withDiscount30: false,
      allOrders: false,
    });

    if (!isSwitchEnabled.withDiscount10) {
      let filterOrdersBy10Discount = Array.from(orders).filter(
        x => x.discount === 10,
      );
      updateFilteredOrdersByTypeOfSorting(
        sorting.typeOfSorting,
        filterOrdersBy10Discount,
      );
    }
  };

  //list of orders with 20 discount
  const toggleCheckBox20Discount = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      withDiscount20: !isSwitchEnabled.withDiscount20,
      history: false,
      placed: false,
      withDiscount10: false,
      withDiscount: false,
      withDiscount30: false,
      allOrders: false,
    });

    if (!isSwitchEnabled.withDiscount20) {
      let filterOrdersBy20Discount = Array.from(orders).filter(
        x => x.discount === 20,
      );

      updateFilteredOrdersByTypeOfSorting(
        sorting.typeOfSorting,
        filterOrdersBy20Discount,
      );
    }
  };

  //list of orders with 30 discount
  const toggleCheckBox30Discount = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      withDiscount30: !isSwitchEnabled.withDiscount30,
      history: false,
      placed: false,
      withDiscount10: false,
      withDiscount20: false,
      withDiscount: false,
      allOrders: false,
    });

    if (!isSwitchEnabled.withDiscount30) {
      let filterOrdersBy30Discount = Array.from(orders).filter(
        x => x.discount === 30,
      );

      updateFilteredOrdersByTypeOfSorting(
        sorting.typeOfSorting,
        filterOrdersBy30Discount,
      );
    }
  };

  //list of orders : all
  const toggleSwitchAllOrders = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      history: false,
      placed: false,
      withDiscount: false,
      withDiscount10: false,
      withDiscount20: false,
      withDiscount30: false,
      allOrders: !isSwitchEnabled.allOrders,
    });
    updateFilteredOrdersByTypeOfSorting(sorting.typeOfSorting, orders);
  };

  // -----------sort handler
  const sortHandler = val => {
    updateFilteredOrdersByTypeOfSorting(val, filterOrders);
    setSorting({
      ...sorting,
      typeOfSorting: val,
    });
  };

  return (
    <View style={styles.orderContainer}>
      <View style={styles.backButton}>
        <Icon
          name="arrowleft"
          type="ant-design"
          style={styles.icon}
          size={26}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* --------------------------- FILTERS CONTAINER --------------------*/}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterItem}
          onPress={() => openCloseFiltersModalHandler()}
          activeOpacity={0.5}>
          <Icon
            style={styles.filterItem}
            name={'filter'}
            type={'feather'}
            color={colors.backgroundBottomTabInactive}
            size={30}
          />
        </TouchableOpacity>
        <Text style={styles.textFilter}>Filtre</Text>
      </View>

      {/* ------------------------------- FILTERS MODAL -------------------------- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => openCloseFiltersModalHandler()}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {/* ----------- CLOSE BUTTON */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => openCloseFiltersModalHandler()}
                activeOpacity={0.5}>
                <Icon
                  name={'closecircleo'}
                  type={'antdesign'}
                  color={colors.white}
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.textModalTitle}>Filtre</Text>

            {/* Modal Container Filters */}
            <View style={styles.modalInsideContainer}>
              <View style={styles.flexDirectionRow}>
                <Text style={styles.textModalFilterItem}>Istoric comenzi</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={'#f4f3f4'}
                  onValueChange={toggleSwitchHistory}
                  value={isSwitchEnabled.history}
                />
              </View>
              <View style={styles.flexDirectionRow}>
                <Text style={styles.textModalFilterItem}>
                  Comenzile plasate
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={'#f4f3f4'}
                  onValueChange={toggleSwitchPlaced}
                  value={isSwitchEnabled.placed}
                />
              </View>
              <View style={styles.flexDirectionRow}>
                <Text style={styles.textModalFilterItem}>
                  Comenzile cu reducere
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={'#f4f3f4'}
                  onValueChange={toggleSwitchDiscount}
                  value={isSwitchEnabled.withDiscount}
                />
              </View>
              <View style={styles.flexDirectionRow}>
                <Text style={styles.textModalFilterItem}>
                  Comenzi cu 10 % Reducere
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={'#f4f3f4'}
                  onValueChange={toggleCheckBox10Discount}
                  value={isSwitchEnabled.withDiscount10}
                />
              </View>
              <View style={styles.flexDirectionRow}>
                <Text style={styles.textModalFilterItem}>
                  Comenzi cu 20 % Reducere
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={'#f4f3f4'}
                  onValueChange={toggleCheckBox20Discount}
                  value={isSwitchEnabled.withDiscount20}
                />
              </View>
              <View style={styles.flexDirectionRow}>
                <Text style={styles.textModalFilterItem}>
                  Comenzi cu 30 % Reducere
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={'#f4f3f4'}
                  onValueChange={toggleCheckBox30Discount}
                  value={isSwitchEnabled.withDiscount30}
                />
              </View>
              <View style={[styles.flexDirectionRow, {marginBottom: 10}]}>
                <Text style={styles.textModalFilterItem}>Toate comenzile</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={'#f4f3f4'}
                  onValueChange={toggleSwitchAllOrders}
                  value={isSwitchEnabled.allOrders}
                />
              </View>

              <Text style={styles.textModalTitle}>Sortari</Text>

              {/* ------------------ SORTING ----------------- */}
              <View style={styles.modalInsideContainer}>
                <View style={styles.flexDirectionRow}>
                  <RadioButton.Group
                    onValueChange={newValue => sortHandler(newValue)}
                    value={sorting.typeOfSorting}>
                    {/* <View style={styles.genderContainer}> */}
                    <View style={styles.genderItem}>
                      <Text style={styles.genderTextItem}>
                        Sorteaza dupa cele mai recente
                      </Text>
                      <RadioButton value="Desc" color={'#f4f3f4'} />
                    </View>
                    <View style={styles.genderItem}>
                      <Text style={styles.genderTextItem}>
                        Sorteaza dupa cele mai vechi
                      </Text>
                      <RadioButton value="Asc" color={'#f4f3f4'} />
                    </View>
                    {/* </View> */}
                  </RadioButton.Group>
                </View>
              </View>
            </View>
            {/* END OF FILTERS */}
          </View>
          {/* END OF MODAL VIEW */}
        </View>
        {/* END OF CENTERVIEW */}
      </Modal>

      {/* ----------------------------LIST OF ORDERS -------------------------- */}
      {filterOrders.length !== 0 ? (
        <View style={styles.ordersFlatListContainer}>
          <FlatList
            data={filterOrders}
            keyExtractor={item => item.id}
            renderItem={renderOrder}
          />
        </View>
      ) : (
        <RenderEmptyList title_message="Momentan nu aveti comenzi!" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  ordersFlatListContainer: {
    paddingTop: 10,
    marginBottom: 60,
    marginTop: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: width * 0.87,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 10,
    borderBottomColor: colors.backgroundButtonActive,
    borderBottomWidth: 1,
    paddingBottom: 4,
    position: 'absolute',
    top: 0,
  },
  filterItem: {
    paddingRight: 10,
  },
  textFilter: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: colors.backgroundButtonActive,
    // marginTop: 4,
    paddingLeft: -10,
  },
  filtersModalContainer: {
    height: windowheight,
    width: width,
    backgroundColor: colors.backgroundApp,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeModalButton: {
    position: 'absolute',
    top: 3,
    right: -width * 0.04,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    // flex: 1,
    width: width,
    height: windowheight * 0.98,
    // margin: 20,
    backgroundColor: colors.backgroundBottomTabInactive90,
    borderRadius: 20,
    marginBottom: 30,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalInsideContainer: {
    flex: 1,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    // marginLeft: -width * 0.1,
  },
  textModalTitle: {
    fontSize: 26,
    color: colors.white,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 2,
  },
  textModalFilterItem: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '500',
    textAlign: 'left',
    letterSpacing: 1,
  },
  flexDirectionRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  genderContainerParent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 2,
  },
  genderContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingRight: 2,
    // marginLeft: 5,
  },
  genderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // marginLeft: 5,
    // marginTop: 3,
  },
  genderTextItem: {
    fontSize: 18,
    paddingTop: 6,
    paddingRight: 2,
    color: colors.white,
    fontWeight: '600',
  },
});
export default OrdersScreen;
