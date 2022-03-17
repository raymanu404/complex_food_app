import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableHighlight,
} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import colors from '../../../config/colors/colors';
import Ticket from '../../components/Ticket';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const menu_container_width = width - 50;

function Tickets() {
  const soldUser = 100;
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.container}>
        <View style={styles.balance_container}>
          <Text style={styles.text_balance}>
            Sold disponibil : {soldUser} RON
          </Text>
        </View>
        <ScrollView style={{marginBottom: 20}}>
          {/* TICKET 10 RON  */}
          <Ticket reducere={10} pret={10} cupoane={'1 Cupon'} />
          {/* TICKET 30 RON  */}
          <Ticket reducere={20} pret={30} cupoane={'3 Cupoane'} />
          {/* TICKET 50 RON  */}
          <Ticket reducere={30} pret={50} cupoane={'5 Cupoane'} />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    backgroundColor: colors.backgroundApp,
  },
  balance_container: {
    // flex: 1,
    width: width,
    height: 50,
    backgroundColor: colors.backgroundBottomTabInactive,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_balance: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ticket_container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 200,
    width: menu_container_width,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    backgroundColor: colors.white,
  },
  ticket: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: menu_container_width - 40,
    height: 180,
    backgroundColor: colors.backgroundBottomTabInactive,
    borderRadius: 12,
  },
  ticket_inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 10,
  },
  text_ticket: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
  },
  ticket_info: {
    width: 150,
    height: 110,
    backgroundColor: colors.blackGrey,
    marginRight: 20,
    justifyContent: 'center',
  },
  ticket_price: {
    width: 110,
    height: 110,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: 150,
    height: 34,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 16,
    backgroundColor: colors.colorBottomInactiveText,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  text_reducere: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: colors.black,
  },
});
export default Tickets;
