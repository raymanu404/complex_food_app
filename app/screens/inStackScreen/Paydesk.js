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
import RenderToastMessage from '../../components/RenderToastMessage';

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
  const [displayMessage, setDisplayMessage] = useState({
    successTitle: '',
    successMessage: '',
    failTitle: '',
    failMessage: '',
  });
  const [showRenderToast, setShowRenderToast] = useState({
    success: false,
    fail: false,
  });

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
    city: '',
    country: '',
    address: '',
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

  const RenderToastSuccess = props => {
    return (
      <RenderToastMessage
        multiplier={0.62}
        showComponent={props.showComponent}
        status={'success'}
        title_message={props.title_message}
        message={props.message}
      />
    );
  };

  const RenderToastFail = props => {
    return (
      <RenderToastMessage
        multiplier={0.62}
        showComponent={props.showComponent}
        status={'fail'}
        title_message={props.title_message}
        message={props.message}
      />
    );
  };

  const checkUserDataFromForm = () => {
    if (userInfoBilling.country === '') {
      setDisplayMessage({
        ...displayMessage,
        failTitle: 'Eroare!',
        failMessage: 'Tara invalida!',
      });

      setShowRenderToast({
        ...showRenderToast,
        success: false,
        fail: true,
      });
      return;
    }

    if (userInfoBilling.city === '') {
      setDisplayMessage({
        ...displayMessage,
        failTitle: 'Eroare!',
        failMessage: 'Oras invalid!',
      });

      setShowRenderToast({
        ...showRenderToast,
        success: false,
        fail: true,
      });
      return;
    }

    if (userInfoBilling.address === '') {
      setDisplayMessage({
        ...displayMessage,
        failTitle: 'Eroare!',
        failMessage: 'Adresa invalida!',
      });

      setShowRenderToast({
        ...showRenderToast,
        success: false,
        fail: true,
      });
      return;
    }

    if (Number(userInfoBilling.amount) === 0) {
      setDisplayMessage({
        ...displayMessage,
        failTitle: 'Eroare!',
        failMessage: 'Suma pentru depunere este de minim 2 RON',
      });

      setShowRenderToast({
        ...showRenderToast,
        success: false,
        fail: true,
      });
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
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
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
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
    setUserInfoBilling({
      ...userInfoBilling,
      address: val,
    });
  };
  const changeCityHandler = val => {
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
    setUserInfoBilling({
      ...userInfoBilling,
      city: val,
    });
  };
  const changeCountryHandler = val => {
    setShowRenderToast({
      ...showRenderToast,
      success: false,
      fail: false,
    });
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
    try {
      checkUserDataFromForm();
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
          setDisplayMessage({
            ...displayMessage,
            failTitle: 'Eroare!',
            failMessage: 'Upps, eroare de plata!',
          });

          setShowRenderToast({
            ...showRenderToast,
            success: true,
            fail: false,
          });
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
              setDisplayMessage({
                ...displayMessage,
                successTitle: 'Succes!',
                successMessage: 'Depunerea dumeanvoastra a fost cu succes!',
              });

              setShowRenderToast({
                ...showRenderToast,
                success: true,
                fail: false,
              });
              if (route.params.onGoBack) {
                route.params.onGoBack(userInfoBilling.amount);
              }
              setTimeout(() => {
                navigation.goBack();
              }, 1000);
            } else {
              setDisplayMessage({
                ...displayMessage,
                failTitle: 'Eroare!',
                failMessage: `Depozitare nereusita ${reponseDepositBalance.data}`,
              });

              setShowRenderToast({
                ...showRenderToast,
                success: true,
                fail: false,
              });
            }
          }
        }

        // console.log(error.message);
      } else {
        setDisplayMessage({
          ...displayMessage,
          failTitle: 'Eroare!',
          failMessage: 'Cardul este invalid!',
        });

        setShowRenderToast({
          ...showRenderToast,
          success: true,
          fail: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const amountOnBlurHandler = flag => {
    if (countOnBlurAmount === 0) {
      if (flag) {
        setCountOnBlurAmount(countOnBlurAmount + 1);
        console.log(`on blur amount : ${countOnBlurAmount}`);
        // initializePaymentSheet();
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
          <>
            {showRenderToast.success ? (
              <RenderToastSuccess
                showComponent={true}
                title_message={displayMessage.successTitle}
                message={displayMessage.successMessage}
              />
            ) : showRenderToast.fail ? (
              <RenderToastFail
                showComponent={true}
                title_message={displayMessage.failTitle}
                message={displayMessage.failMessage}
              />
            ) : (
              <View style={styles.emptyDiv}></View>
            )}
          </>
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
  emptyDiv: {
    marginBottom: 60,
  },
});

export default PayDesk;
