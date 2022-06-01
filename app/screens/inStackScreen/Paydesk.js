import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  TextInput,
  Platform,
  UIManager,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
} from 'react-native';
import UserField from '../../components/UserField';
import colors from '../../../config/colors/colors';
import * as Animatable from 'react-native-animatable';
import {
  useConfirmPayment,
  StripeProvider,
  CardField,
  CardForm,
  useStripe,
} from '@stripe/stripe-react-native';
import api_axios from '../../../config/api/api_axios';

const width = Dimensions.get('screen').width;
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function PayDesk({navigation, route}) {
  const [publishableKey, setPublishableKey] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [countOnBlurAmount, setCountOnBlurAmount] = useState(0);
  const [textButtonPay, setTextButtonPay] = useState('Plateste');
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const {confirmPayment, loading} = useConfirmPayment();

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);

  const {buyerId, email, firstName, lastName, phoneNumber} =
    route.params.userInfo;

  const [userInfoBilling, setUserInfoBilling] = useState({
    amount: 0,
    city: 'Lugoh',
    country: 'RO',
    address: 'str gh',
    validDataCard: false,
    completeCart: false,
  });

  useEffect(() => {
    const getPublishableKey = async () => {
      try {
        let headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };
        const response = await api_axios.get(
          '/payment/publishableKey',
          headers,
        );
        if (response.status === 200) {
          setPublishableKey(response.data);
        }
      } catch (error) {
        console.log(error.response.status);
      }
    };
    getPublishableKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPayementIntentClientSecret = async () => {
    try {
      let headers = {
        'Content-Type': 'application/json',
      };
      const dataToSend = {
        fullName: firstName + ' ' + lastName,
        email: email,
        country: userInfoBilling.country,
        city: userInfoBilling.city,
        addressLine1: userInfoBilling.address,
        phone: phoneNumber,
        amount: userInfoBilling.amount,
      };

      const reponseCreatePaymentIntent = await api_axios.post(
        '/payment/create-payment-intent',
        dataToSend,
        headers,
      );

      if (reponseCreatePaymentIntent.status === 200) {
        const clientSecretFromApi =
          reponseCreatePaymentIntent.data.clientSecret;
        setClientSecret(clientSecretFromApi);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkUserDataFromForm = () => {
    if (userInfoBilling.country === '') {
      Alert.alert('Tara invalida!', 'Tara este invalida!');
      return;
    }

    if (userInfoBilling.city === '') {
      Alert.alert('Oras invalid!', 'Orasul este invalid!');
      return;
    }

    if (userInfoBilling.address === '') {
      Alert.alert('Adresa invalida!', 'Adresa este invalida!');
      return;
    }

    if (userInfoBilling.amount === 0) {
      Alert.alert('Suma invalida!', 'Suma pentru depunere este invalida!');
      return;
    }
    // let userinfo = {
    //   email: userInfoBilling.email,
    //   firstName: userInfoBilling.firstName,
    //   lastName: userInfoBilling.lastName,
    //   amount: userInfoBilling.amount,
    //   city: userInfoBilling.city,
    //   country: userInfoBilling.country,
    //   address: userInfoBilling.address,
    // };
    // navigation.navigate('CheckoutPaymentScreen', userinfo);
  };

  const amountTextHandler = val => {
    if (Number(val) > 0) {
      setTextButtonPay(`Plateste ${val + ' RON'}`);
      setUserInfoBilling({
        ...userInfoBilling,
        amount: Number(val),
      });
    } else {
      setTextButtonPay('Plateste');
      setUserInfoBilling({
        ...userInfoBilling,
        amount: Number(val),
      });
    }
  };

  const changeAddressHandler = val => {
    setUserInfoBilling({
      ...userInfoBilling,
      address: val,
    });
  };
  const changeCityHandler = val => {
    setUserInfoBilling({
      ...userInfoBilling,
      city: val,
    });
  };
  const changeCountryHandler = val => {
    setUserInfoBilling({
      ...userInfoBilling,
      country: val,
    });
  };

  const initializePaymentSheet = async () => {
    try {
      checkUserDataFromForm();
      fetchPayementIntentClientSecret();
      if (!clientSecret) {
        return;
      }

      // await initPaymentSheet({
      //   merchantDisplayName: 'Example Inc.',
      //   paymentIntentClientSecret: clientSecret,
      //   appearance: {
      //     primaryButton: {
      //       colors: colors.backgroundButtonActive,
      //       font: 16,
      //       shapes: {
      //         borderRadius: 16,
      //         borderWidth: 1,
      //       },
      //     },
      //     colors: {
      //       primaryText: 'Introduceti datele de plata',
      //       secondaryText: 'Informatii card',
      //     },
      //     shapes: {
      //       borderRadius: 16,
      //       borderWidth: 1,
      //     },
      //   },
      // });
      // const {error} = await presentPaymentSheet();
      // if (error) {
      //   Alert.alert(`Error code: ${error.code}`, error.message);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  const confirmPaymentFunction = async () => {
    console.log('asfaf');
    try {
      fetchPayementIntentClientSecret();
      if (!clientSecret) {
        return;
      }

      if (userInfoBilling.completeCart && userInfoBilling.validDataCard) {
        const {error, paymentIntent} = await confirmPayment(clientSecret, {
          type: 'Card',
          paymentMethodType: 'Card',
        });
        if (error) {
          Alert.alert(
            'Error',
            `error message: ${error.message} with error code: ${error.code}`,
          );
        } else {
          console.log(paymentIntent);
          if (paymentIntent.status === 'Succeeded') {
            let headers = {
              'Content-Type': 'application/json',
            };
            const balanceToSend = {
              balance: Number(userInfoBilling.amount).toFixed(2),
            };
            const reponseDepositBalance = await api_axios.patch(
              `/buyers/deposit-balance/${buyerId}`,
              balanceToSend,
              headers,
            );

            if (reponseDepositBalance.status === 200) {
              Alert.alert(
                'Depozitare reusita!',
                `${reponseDepositBalance.data}`,
              );
              if (route.params.onGoBack) {
                route.params.onGoBack(userInfoBilling.amount);
              }
              navigation.goBack();
            } else {
              Alert.alert(
                'Depozitare nereusita!',
                `${reponseDepositBalance.data}`,
              );
            }
          }
        }

        // console.log(error.message);
      } else {
        Alert.alert('Validare incompleta', 'Valideaza-ti cardul!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const amountOnBlurHandler = flag => {
    if (countOnBlurAmount === 0) {
      if (flag) {
        setCountOnBlurAmount(countOnBlurAmount + 1);
        initializePaymentSheet();
      }
    }
  };

  const countryOnBlurHandler = flag => {
    if (flag) {
      // ref2.current.focus();
    }
  };

  const cityOnBlurHandler = flag => {
    if (flag) {
      // ref3.current.focus();
    }
  };
  const addressOnBlurHandler = flag => {
    if (flag) {
      // ref4.current.focus();
    }
  };

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier">
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={styles.userInputContainer}>
          <UserField
            widthStyle={width - 30}
            colorBackground={colors.backgroundBottomTabInactive}
            nameIcon={'information-circle-outline'}
            typeIcon={'ionicon'}
            labelField={'Tara'}
            dataField={' '}
            value={userInfoBilling.country}
            settingsMode={true}
            changeTextInput={changeCountryHandler}
            OnBlurMethod={countryOnBlurHandler}
            returnKeyTypeBoolean={true}
            ref={ref1}
          />
          <UserField
            widthStyle={width - 30}
            colorBackground={colors.backgroundBottomTabInactive}
            nameIcon={'location-city'}
            typeIcon={'material'}
            labelField={'Oras'}
            dataField={' '}
            value={userInfoBilling.city}
            settingsMode={true}
            changeTextInput={changeCityHandler}
            OnBlurMethod={cityOnBlurHandler}
            returnKeyTypeBoolean={true}
            ref={ref2}
          />
          <UserField
            widthStyle={width - 30}
            colorBackground={colors.backgroundBottomTabInactive}
            nameIcon={'home'}
            typeIcon={'antdesign'}
            labelField={'Adresa'}
            dataField={' '}
            value={userInfoBilling.address}
            settingsMode={true}
            changeTextInput={changeAddressHandler}
            OnBlurMethod={addressOnBlurHandler}
            returnKeyTypeBoolean={true}
            ref={ref3}
          />
          {/* <UserField
          widthStyle={width - 30}
          colorBackground={colors.backgroundBottomTabInactive}
          nameIcon={'home'}
          typeIcon={'antdesign'}
          labelField={'Judet'}
          dataField={'Judet'}
          value={userInfoBilling.address}
          settingsMode={true}
          changeTextInput={changeAddressHandler}
        />
        */}
          {/* <UserField
            widthStyle={width - 30}
            colorBackground={colors.backgroundBottomTabInactive}
            nameIcon={'home'}
            typeIcon={'antdesign'}
            labelField={'Cod Postal'}
            dataField={'Cod Postal'}
            value={userInfoBilling.address}
            settingsMode={true}
            changeTextInput={changePostalCodeHandler}
          /> */}
          <View style={styles.amountContainer}>
            <UserField
              widthStyle={width * 0.5}
              colorBackground={colors.backgroundBottomTabInactive}
              nameIcon={'cash-outline'}
              typeIcon={'ionicon'}
              labelField={'Suma'}
              dataField={' '}
              value={userInfoBilling.amount}
              settingsMode={true}
              changeTextInput={amountTextHandler}
              OnBlurMethod={amountOnBlurHandler}
              returnKeyTypeBoolean={false}
              ref={ref4}
            />
            <UserField
              widthStyle={width * 0.2}
              colorBackground={colors.backgroundBottomTabInactive}
              labelField={'RON'}
            />
          </View>
          <CardField
            postalCodeEnabled={false}
            placeholders={{
              number: '4242 4242 4242 4242',
            }}
            onCardChange={cardDetails => {
              console.log('card details', cardDetails);
              if (cardDetails.complete) {
                setUserInfoBilling({
                  ...userInfoBilling,
                  completeCart: true,
                  validDataCard: false,
                });
              }
              if (
                cardDetails.complete &&
                cardDetails.validCVC === 'Valid' &&
                cardDetails.validExpiryDate === 'Valid' &&
                cardDetails.validNumber === 'Valid'
              ) {
                setUserInfoBilling({
                  ...userInfoBilling,
                  completeCart: true,
                  validDataCard: true,
                });
              }
            }}
            cardStyle={{
              borderRadius: 20,
            }}
            style={styles.cardFieldContainer}
          />
          {!loading ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={{marginTop: 10}}
              onPress={() => confirmPaymentFunction()}>
              <UserField
                widthStyle={240}
                colorBackground={colors.backgroundButtonActive}
                nameIcon={'creditcard'}
                typeIcon={'antdesign'}
                labelField={textButtonPay}
                sizeIcon={26}
              />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator
              size="large"
              color={colors.backgroundButtonActive}
              style={{marginTop: 10}}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  userInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFieldContainer: {
    width: width * 0.92,
    height: 50,
  },
  textInput: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    alignSelf: 'center',
    width: 100,
    paddingLeft: 20,
    color: colors.white,
    backgroundColor: colors.backgroundButtonActive,
    borderRadius: 20,
    fontSize: 16,
    height: 48,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 30,
  },
});

export default PayDesk;
