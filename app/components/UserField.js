import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';
import colors from '../../config/colors/colors';
import {Icon} from 'react-native-elements';

function UserField(props) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState(props.value);

  const changeTextHandler = val => {
    if (val.length !== 0) {
      setValue(val);
    } else {
      setValue(val);
    }
  };
  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: props.widthStyle,
      height: 40,
      borderRadius: 10,
      marginTop: 7,
      marginBottom: 7,
      backgroundColor: props.colorBackground,
    },
    buttonText: {
      textAlign: 'center',
      color: colors.white,
      fontWeight: 'bold',
      fontSize: 15,
      letterSpacing: 1,
    },
    iconLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    icon: {
      paddingLeft: 10,
      paddingRight: 10,
    },
    textInput: {
      display: 'flex',
      alignSelf: 'center',
      paddingLeft: 10,
      color: colors.white,
      fontSize: 15,
      width: props.widthStyle,
      height: 48,
    },
    textInputFocusOn: {
      display: 'flex',
      alignSelf: 'center',
      paddingLeft: 10,
      color: colors.white,
      fontSize: 17,
      width: props.widthStyle,
      height: 48,
    },
  });
  return (
    <View style={props.buttonStyle ? props.buttonStyle : styles.button}>
      {props.dataField ? (
        <View style={styles.iconLabel}>
          {props.typeOfTicket ? (
            <>
              <Icon
                name={props.nameIcon}
                type={props.typeIcon}
                size={props.sizeIcon ? props.sizeIcon : 30}
                color={colors.white}
                style={{paddingLeft: 5}}
              />
              <Icon
                name={props.nameIcon2}
                type={props.typeIcon}
                size={props.sizeIcon ? props.sizeIcon : 30}
                color={colors.white}
                style={{paddingRight: 10, marginLeft: -5}}
              />
            </>
          ) : (
            <Icon
              name={props.nameIcon}
              type={props.typeIcon}
              size={props.sizeIcon ? props.sizeIcon : 30}
              color={colors.white}
              style={styles.icon}
            />
          )}

          {!props.settingsMode ? (
            <Text style={styles.buttonText}>{props.labelField} </Text>
          ) : (
            <TextInput
              onChangeText={val => changeTextHandler(val)}
              keyboardType={props.phoneType ? 'phone-pad' : 'default'}
              value={value}
              style={[
                !focus ? styles.textInput : styles.textInputFocusOn,
                {fontWeight: '500'},
              ]}
              onFocus={() => setFocus(true)}
              onBlur={() => {
                setFocus(false);
                props.changeTextInput(value);
              }}
              autoCapitalize="none"
              placeholder={props.labelField}
              placeholderTextColor={colors.blackGrey}
              key={props.labelField}
              secureTextEntry={props.passwordType}
            />
          )}

          <View style={{justifyContent: 'flex-end', flex: 1}}>
            <Text style={styles.buttonText}>{props.dataField}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.iconLabel}>
          <Icon
            name={props.nameIcon}
            type={props.typeIcon}
            size={props.sizeIcon ? props.sizeIcon : 30}
            color={colors.white}
            style={[styles.icon, {paddingRight: 0}]}
          />
          <View style={{justifyContent: 'center', flex: 1}}>
            <Text style={styles.buttonText}>{props.labelField} </Text>
          </View>
          {props.updown ? (
            <Icon
              name={props.arrowName}
              type={'antdesign'}
              size={props.sizeIcon ? props.sizeIcon : 30}
              color={colors.white}
              style={styles.icon}
            />
          ) : null}
        </View>
      )}
    </View>
  );
}

export default UserField;
