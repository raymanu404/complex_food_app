import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Dimensions, FlatList} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import api_axios from '../../../config/api/api_axios';
import RenderEmptyList from '../../components/RenderEmptyList';
import Order from '../../components/Order';

function OrdersScreen({navigation, route}) {
  const [orders, setOrders] = useState([]);
  const buyerId = route.params.buyerId;

  useEffect(() => {
    const getOrders = async () => {
      try {
        let headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };

        const response = await api_axios.get(`/orders/${buyerId}`, headers);
        setOrders(response.data);
      } catch (error) {
        console.log(error.response.status);
      }
    };
    getOrders();
  }, [buyerId]);

  const goToOrderItemHandler = orderId => {
    navigation.navigate('OrderItemsScreen', {
      orderId: orderId,
    });
  };
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
      {orders.length !== 0 ? (
        <View style={styles.ordersFlatListContainer}>
          <FlatList
            data={orders}
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
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  ordersFlatListContainer: {
    paddingTop: 10,
    marginBottom: 60,
  },
});
export default OrdersScreen;
