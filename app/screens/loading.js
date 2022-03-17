import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

function Loading() {
  return (
    <View style={styles.container}>
      <Text>Loading Screen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;
