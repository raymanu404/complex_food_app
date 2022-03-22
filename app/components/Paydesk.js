import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, Keyboard, TextInput} from 'react-native';
import stripe from 'tipsi-stripe';

stripe.setOptions({
  publishableKey:
    'pk_test_51KgAO3GSnWTvEvr5ULWilZV2KGbJAZTy3RBUo6iRG8spo0N00I8niMWUCPjbaGydjp7zUX0zEWMldb7tUkbIgINY00N9y8m9Ah',
  androidPayMode: 'test', // Android only
});

function PayDesk(props) {
  return (
    <View>
      {/* <CardFromScreen /> */}
      <Text>Payment</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

export default PayDesk;
