import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native';
import api_axios from '../../../config/api/api_axios';
import Coupon from '../../components/Coupon';
import RenderEmptyList from '../../components/RenderEmptyList';

const height = Dimensions.get('screen').height;

function CouponsList({navigation, route}) {
  const buyerID = route.params.buyerID || 2;
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      category: 1,
      dateCreated: '07/04/2022 19:23',
      code: 'aoshfa',
    },
    {
      id: 2,
      category: 2,
      dateCreated: '07/04/2022 19:23',
      code: 'afasfas2',
    },
    {
      id: 3,
      category: 2,
      dateCreated: '07/04/2022 19:23',
      code: 'asfa',
    },
    {
      id: 4,
      category: 3,
      dateCreated: '07/04/2022 19:23',
      code: 'agag',
    },
  ]);

  useEffect(() => {
    const getCoupons = async () => {
      try {
        let headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };
        const response = await api_axios.get(`/coupons/${buyerID}`, headers);

        if (response.data.length !== 0) {
          const couponsFromAPI = response.data.sort(function (a, b) {
            return a.type - b.type;
          });
          setCoupons(couponsFromAPI);
        }
      } catch (error) {
        console.log(error.response.status);
        setCoupons([]);
      }
    };
    getCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyCouponForBuyer = async code => {
    try {
      var filtered = coupons.filter(function (value, index) {
        return String(value.code) !== String(code);
      });

      setCoupons(filtered);
      route.params.onGoBack(code);
      // navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };
  const renderCouponItem = ({item, index}) => (
    <Coupon
      type={item.type}
      dateCreated={item.dateCreated}
      code={item.code}
      applyCoupon={() => applyCouponForBuyer(item.code)}
    />
  );
  return (
    <View style={styles.container}>
      {coupons.length !== 0 ? (
        <FlatList
          data={coupons}
          renderItem={renderCouponItem}
          key={key => key.id}
        />
      ) : (
        <RenderEmptyList title_message={'Nu aveti cupoane de reducere'} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    marginBottom: 60,
    marginTop: 10,
  },
});

export default CouponsList;
