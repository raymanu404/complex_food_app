import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Pressable,
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

const windowheight = Dimensions.get('window').height;
const width = Dimensions.get('screen').width;

function OrdersScreen({navigation, route}) {
  const [orders, setOrders] = useState([]);
  const buyerId = route.params.buyerId;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSwitchEnabled, setIsSwitchEnabled] = useState({
    history: false,
    placed: false,
    widthDiscount: false,
    allOrders: false,
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
      setFilterOrders(filterOrdersByOrderStatusDone);
    }
  };

  //list of orders with orderStatus : placed
  const toggleSwitchPlaced = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      placed: !isSwitchEnabled.placed,
      allOrders: false,
    });

    if (!isSwitchEnabled.placed) {
      let filterOrdersByOrderStatusPlaced = Array.from(orders).filter(
        x => x.status === 1,
      );
      setFilterOrders(filterOrdersByOrderStatusPlaced);
    }
  };

  //list of orders with orderStatus : with discount != 0
  const toggleSwitchDiscount = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      widthDiscount: !isSwitchEnabled.widthDiscount,
      allOrders: false,
    });

    if (!isSwitchEnabled.widthDiscount) {
      let filterOrdersByDiscount = Array.from(orders).filter(
        x => x.discount !== 0,
      );
      setFilterOrders(filterOrdersByDiscount);
    }
  };

  //list of orders : all
  const toggleSwitchAllOrders = () => {
    setIsSwitchEnabled({
      ...isSwitchEnabled,
      history: false,
      placed: false,
      widthDiscount: false,
      allOrders: !isSwitchEnabled.allOrders,
    });
    setFilterOrders(orders);
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
                  value={isSwitchEnabled.widthDiscount}
                />
              </View>
              <View style={styles.flexDirectionRow}>
                <Text style={styles.textModalFilterItem}>Toate comenzile</Text>
                <Switch
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  thumbColor={'#f4f3f4'}
                  onValueChange={toggleSwitchAllOrders}
                  value={isSwitchEnabled.allOrders}
                />
              </View>
            </View>
          </View>
        </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: -width * 0.3,
  },
  textModalTitle: {
    fontSize: 26,
    color: colors.white,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 2,
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
    marginTop: 40,
  },
});
export default OrdersScreen;
