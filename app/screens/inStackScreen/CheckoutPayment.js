import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {
  useConfirmPayment,
  StripeProvider,
  CardField,
  CardForm,
  useStripe,
} from '@stripe/stripe-react-native';
import api_axios from '../../../config/api/api_axios';
import UserField from '../../components/UserField';
import colors from '../../../config/colors/colors';
import * as Animatable from 'react-native-animatable';

const width = Dimensions.get('screen').width;
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function CheckoutPayment({navigation, route}) {
  const [publishableKey, setPublishableKey] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const {confirmPayment, loading} = useConfirmPayment();
  const {email, firstName, lastName, amount, city, country, address} =
    route.params;

  const [userInfoBilling, setUserInfoBilling] = useState({
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
        email: email,
        amount: amount,
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
  const initializePaymentSheet = async () => {
    try {
      fetchPayementIntentClientSecret();
      if (!clientSecret) {
        return;
      }
      confirmPaymentFunction();
      // await initPaymentSheet({
      //   merchantDisplayName: 'Example Inc.',
      //   paymentIntentClientSecret: clientSecret,
      //   defaultBillingDetails: {
      //     email: email,
      //     name: firstName + ' ' + lastName,
      //     address: {
      //       country: country,
      //       city: city,
      //       line1: address,
      //       postalCode: '305500',
      //       state: 'timis',
      //     },
      //   },
      // });
      // const {error} = await presentPaymentSheet();
      // if (error) {
      //   Alert.alert(`Error code: ${error.code}`, error.message);
      // }
      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmPaymentFunction = async () => {
    try {
      if (!clientSecret) {
        return;
      }

      if (userInfoBilling.completeCart && userInfoBilling.validDataCard) {
        const {error, paymentIntent} = await confirmPayment(clientSecret, {
          type: 'Card',
          billingDetails: {
            email: email,
            name: firstName + ' ' + lastName,
            address: {
              city: city,
              country: country,
            },
          },
        });
        if (error) {
          Alert.alert(
            'Error',
            `error message: ${error.message} with error code: ${error.code}`,
          );
        } else {
          Alert.alert(`${paymentIntent.id}`);
        }

        console.log(paymentIntent);
        // console.log(error.message);
      } else {
        Alert.alert('Validate incompleted!', 'Validate your card!');
      }
    } catch (error) {
      console.log(error);
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => initializePaymentSheet()}>
            <UserField
              widthStyle={240}
              colorBackground={colors.backgroundButtonActive}
              nameIcon={'payment'}
              typeIcon={'material'}
              labelField={'Depunere'}
              sizeIcon={26}
            />
          </TouchableOpacity>
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
    width: width * 0.9,
    height: 50,
  },
});

export default CheckoutPayment;
