import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import api_axios from '../../../config/api/api_axios';
import colors from '../../../config/colors/colors';
import Coupon from '../../components/Coupon';
import RenderEmptyList from '../../components/RenderEmptyList';
import RenderToastMessage from '../../components/RenderToastMessage';
import {Icon} from 'react-native-elements';
import Loading from '../loading';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

function CouponsList({navigation, route}) {
  const buyerID = route.params.buyerID || 2;
  const userMode = route.params.userMode || false;
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState({
    filter: 0,
    coupons1: [],
    coupons2: [],
    coupons3: [],
    numberCoupons: 0,
  });

  const [showRenderToast, setShowRenderToast] = useState({
    success: false,
    fail: false,
  });

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
          setFilterType({
            ...filterType,
            filter: 0,
            numberCoupons: Array.from(couponsFromAPI).length,
          });
        }
      } catch (error) {
        console.log(error.response.status);
        setCoupons([]);
      }
      setLoading(false);
    };
    getCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <Loading />;
  }

  const RenderToastSuccess = props => {
    return (
      <RenderToastMessage
        multiplier={0.77}
        showComponent={props.showComponent}
        status={'success'}
        title_message={'Succes!'}
        message={'Cuponul de reducere a fost aplicat!'}
      />
    );
  };

  const RenderToastFail = props => {
    return (
      <RenderToastMessage
        multiplier={0.77}
        showComponent={props.showComponent}
        status={'fail'}
        title_message={'Eroare!'}
        message={'Upps, a aparut o eroare!'}
      />
    );
  };

  const applyCouponForBuyer = (code, typeOfCoupon) => {
    try {
      var filtered = coupons.filter(function (value, index) {
        return String(value.code) !== String(code);
      });

      setCoupons(filtered);
      route.params.onGoBack(code, typeOfCoupon);
      setShowRenderToast({
        ...showRenderToast,
        success: true,
        fail: false,
      });
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const renderCouponItem = ({item, index}) => (
    <Coupon
      type={item.type}
      dateCreated={item.dateCreated}
      code={item.code}
      applyCoupon={() => applyCouponForBuyer(item.code, item.type)}
      userMode={userMode}
    />
  );

  // -------------------- FILTERS HANDLER ----------------
  const sortCouponsByType = () => {
    const couponsFromAPI = coupons.sort(function (a, b) {
      return a.type - b.type;
    });

    setFilterType({
      ...filterType,
      filter: 0,
      numberCoupons: Array.from(couponsFromAPI).length,
    });
    setCoupons(couponsFromAPI);
  };
  const showOnlyTypeOneCoupons = () => {
    var filtered = coupons.filter(function (value, index) {
      return Number(value.type) !== 2 && Number(value.type) !== 3;
    });

    setFilterType({
      ...filterType,
      filter: 1,
      coupons1: filtered,
      numberCoupons: Array.from(filtered).length,
    });
  };
  const showOnlyTypeTwoCoupons = () => {
    var filtered = coupons.filter(function (value, index) {
      return Number(value.type) !== 1 && Number(value.type) !== 3;
    });

    setFilterType({
      ...filterType,
      filter: 2,
      coupons2: filtered,
      numberCoupons: Array.from(filtered).length,
    });
  };
  const showOnlyTypeThreeCoupons = () => {
    var filtered = coupons.filter(function (value, index) {
      return Number(value.type) !== 1 && Number(value.type) !== 2;
    });

    setFilterType({
      ...filterType,
      filter: 3,
      coupons3: filtered,
      numberCoupons: Array.from(filtered).length,
    });
  };

  return (
    <View style={styles.container}>
      {filterType.numberCoupons.length !== 0 ? (
        <>
          {/* --------------------FILTERING / SORT ------------------------ */}
          <View style={styles.filterContainer}>
            <Icon
              style={styles.filterItem}
              name={'filter'}
              type={'feather'}
              color={colors.backgroundBottomTabInactive}
              size={30}
            />
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => sortCouponsByType()}
              activeOpacity={0.5}>
              <Icon
                name={'list-number'}
                type={'foundation'}
                color={colors.backgroundBottomTabInactive}
                size={30}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => showOnlyTypeOneCoupons()}
              activeOpacity={0.5}>
              <Icon
                name={'numeric-1-circle-outline'}
                type={'material-community'}
                color={colors.backgroundBottomTabInactive}
                size={30}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => showOnlyTypeTwoCoupons()}
              activeOpacity={0.5}>
              <Icon
                name={'numeric-2-circle-outline'}
                type={'material-community'}
                color={colors.backgroundBottomTabInactive}
                size={30}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterItem}
              onPress={() => showOnlyTypeThreeCoupons()}
              activeOpacity={0.5}>
              <Icon
                name={'numeric-3-circle-outline'}
                type={'material-community'}
                color={colors.backgroundBottomTabInactive}
                size={30}
              />
            </TouchableOpacity>
            <Text style={styles.textFilter}>
              Total cupoane: {filterType.numberCoupons}
            </Text>
          </View>
          {/* -------------------- LIST OF COUPONS  ------------------------ */}
          {filterType.numberCoupons !== 0 ? (
            <View style={styles.couponsContainer}>
              <FlatList
                data={
                  filterType.filter === 0
                    ? coupons
                    : filterType.filter === 1
                    ? filterType.coupons1
                    : filterType.filter === 2
                    ? filterType.coupons2
                    : filterType.filter === 3
                    ? filterType.coupons3
                    : coupons
                }
                renderItem={renderCouponItem}
                key={key => key.id}
              />
            </View>
          ) : (
            <RenderEmptyList title_message={'Nu aveti cupoane de acest tip '} />
          )}
        </>
      ) : (
        <RenderEmptyList title_message={'Nu aveti cupoane de reducere'} />
      )}
      {showRenderToast.success ? (
        <RenderToastSuccess showComponent={true} />
      ) : showRenderToast.fail ? (
        <RenderToastFail showComponent={true} />
      ) : null}
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
  couponsContainer: {
    marginTop: 40,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: width * 0.87,
    marginBottom: 10,
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
    fontSize: 16,
    color: colors.backgroundButtonActive,
    marginTop: 4,
  },
});

export default CouponsList;
