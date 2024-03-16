import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import colors from '../../config/colors/colors';

const width = Dimensions.get('screen').width;
const menu_container_width = width - 50;

function Ticket(props) {
  const typeOfColor =
    props.type === 1
      ? colors.ticket10
      : props.type === 2
      ? colors.ticket20
      : props.type === 3
      ? colors.ticket30
      : colors.ticket10;

  const styles = StyleSheet.create({
    ticket_container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      height: 180,
      width: menu_container_width,
      marginTop: 5,
      marginBottom: 5,
      borderRadius: 16,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
      backgroundColor: typeOfColor,
    },
    ticket: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: menu_container_width - 40,
      height: 160,
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
      height: 80,
      backgroundColor: colors.blackGrey,
      marginRight: 20,
      justifyContent: 'center',
    },
    ticket_price: {
      width: 110,
      height: 80,
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
      shadowColor: colors.black,
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

  return (
    <View style={styles.ticket_container}>
      <View style={styles.ticket}>
        {/* Ticket inside */}
        <View style={styles.ticket_inner}>
          <View style={styles.ticket_info}>
            <Text style={[styles.text_ticket, {color: colors.white}]}>
              {props.cupoane}
            </Text>
            <Text style={[styles.text_ticket, {color: colors.white}]}>
              Reducere {props.reducere}
            </Text>
          </View>
          <View style={styles.ticket_price}>
            <Text
              style={[
                styles.text_ticket,
                {color: colors.backgroundButtonActive},
              ]}>
              PRET
            </Text>
            <Text
              style={[
                styles.text_ticket,
                {color: colors.backgroundButtonActive},
              ]}>
              {props.pret} RON
            </Text>
          </View>
        </View>
        <Text style={styles.text_reducere}>
          *Se scade din suma totala 10 ron + {props.reducere}%*
        </Text>
        <TouchableOpacity onPress={props.payCoupon} activeOpacity={0.8}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Plateste</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Ticket;
