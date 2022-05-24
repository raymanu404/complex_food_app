import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Keyboard,
  TextInput,
  Platform,
  UIManager,
} from 'react-native';
import {
  initStripe,
  CardField,
  CardForm,
  useStripe,
} from '@stripe/stripe-react-native';

const publishableKey =
  'pk_test_51KgAO3GSnWTvEvr5ULWilZV2KGbJAZTy3RBUo6iRG8spo0N00I8niMWUCPjbaGydjp7zUX0zEWMldb7tUkbIgINY00N9y8m9Ah'; //asta ar trebui adus de pe un server

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function PayDesk(props) {
  const {confirmPayment} = useStripe();
  useEffect(() => {
    initStripe({
      publishableKey: publishableKey,
      merchantIdentifier: 'merchant.identifier',
    });
  }, []);

  const PaymentHandle = async () => {
    const {error} = await confirmPayment(publishableKey, {
      type: 'Card',
      billingDetails: {
        email: 'john@email.com',
      },
    });
    console.log(error.message);
  };

  return (
    <View>
      {/* <CardField
        postalCodeEnabled={false}
        onCardChange={cardDetails => {
          console.log('card details', cardDetails);
        }}
        style={{height: 50}}
      /> */}

      <Text onPress={() => PaymentHandle()}>Payment</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

export default PayDesk;
