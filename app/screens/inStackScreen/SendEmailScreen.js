import React, {useState} from 'react';

import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  TouchableHighlight,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import api_axios from '../../../config/api/api_axios';
import colors from '../../../config/colors/colors';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

function SendEmail({navigation, route}) {
  const [onFocusInput, setOnFocusInput] = useState({
    emailOnFocus: false,
  });

  const [userInfo, setUserInfo] = useState({
    email: '',
  });

  const [invalidInput, setInvalidInput] = useState({
    emailError: false,
    emptyFiledsError: '',
  });

  // EMAIL TEXT HANDLER
  const emailTextHandler = val => {
    if (String(val).length !== 0 && validateEmail(val)) {
      setUserInfo({
        ...userInfo,
        email: val,
      });

      setInvalidInput({
        ...invalidInput,
        emailError: false,
      });
    } else {
      setUserInfo({
        ...userInfo,
        email: val,
      });
      setInvalidInput({
        ...invalidInput,
        emailError: true,
      });
    }
  };

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const sendEmailHandler = async () => {
    try {
      const verifyValidData = !invalidInput.emailError;
      const emptyFields = userInfo.email !== '';
      if (verifyValidData && emptyFields) {
        setInvalidInput({
          ...invalidInput,
          emptyFiledsError: '',
        });

        let dataToSend = {
          email: userInfo.email,
        };
        console.log(dataToSend);
        const responseSendEmail = await api_axios.post(
          '/buyers/forgot-password',
          dataToSend,
        );

        if (responseSendEmail.status === 200) {
          if (
            String(responseSendEmail.data).startsWith('A fost trimis mailul!')
          ) {
            let getUserId = String(responseSendEmail.data).split('!')[1];
            navigation.navigate('ConfirmCodeScreen', {
              idUser: Number(getUserId),
              forgotPassword: true,
            });
          }
        }
      } else {
        setInvalidInput({
          ...invalidInput,
          emptyFiledsError: 'Emailul este necompletat/invalid!',
        });
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.iconBack}
          onPress={() => navigation.goBack()}>
          <Icon
            name={'arrow-left'}
            type="feather"
            color={colors.backgroundButtonActive}
          />
        </TouchableOpacity>
        <Text style={styles.textInfo}>Introduceti emailul dumneavoastra!</Text>
        <View style={styles.displayColumn}>
          <View
            style={
              onFocusInput.emailOnFocus
                ? styles.textInputContainerOnFocus
                : styles.textInputContainer
            }>
            <Icon
              name={'mail'}
              type="ant-design"
              color={colors.backgroundButtonActive}
              style={[styles.icon, {paddingLeft: 10}]}
            />
            <TextInput
              returnKeyType="next"
              onChangeText={val => emailTextHandler(val)}
              value={userInfo.email}
              style={[
                !onFocusInput.emailOnFocus
                  ? styles.textInput
                  : styles.textInputFocusOn,
                {fontWeight: '500'},
              ]}
              onFocus={() =>
                setOnFocusInput({...onFocusInput, emailOnFocus: true})
              }
              onBlur={() =>
                setOnFocusInput({...onFocusInput, emailOnFocus: false})
              }
              autoCapitalize="none"
              placeholder="Email"
              placeholderTextColor={colors.backgroundButtonActive}
            />
          </View>
        </View>
        <TouchableHighlight
          underlayColor={colors.backgroundApp}
          onPress={() => sendEmailHandler()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Trimite </Text>
          </View>
        </TouchableHighlight>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainer: {
    // flex: 1,
    display: 'flex',
    width: width * 0.9,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    height: 44,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    borderRadius: 20,
    marginVertical: 5,
  },
  textInputContainerOnFocus: {
    display: 'flex',
    width: width * 0.9,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#FFF',
    height: 46,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    borderRadius: 20,
    marginVertical: 5,
  },
  textInput: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    alignSelf: 'center',
    width: width * 0.6,
    paddingLeft: 10,
    color: 'rgba(47, 134, 166, 1)',
    fontSize: 16,
    height: 48,
  },
  textInputFocusOn: {
    display: 'flex',
    // textAlignVertical: 'center',
    alignSelf: 'center',
    width: width * 0.6,
    // marginTop: Platform.OS === "android" ? 0 : -12,
    paddingLeft: 10,
    color: 'rgba(47, 134, 166, 1)',
    fontSize: 18,
    height: 48,
  },
  iconBack: {
    position: 'absolute',
    top: 10,
    left: 0,
  },
  icon: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  registerSection: {
    flex: 1,
    // display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.02,
  },
  textSuggest: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
    color: colors.backgroundButtonActive,
    fontWeight: '700',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    width: width - 40,
    height: 42,
    borderRadius: 16,
    backgroundColor: 'rgba(47, 134, 166, 1)',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  textErrorInput: {
    paddingLeft: 10,
    textAlign: 'left',
    fontSize: 14,
    color: colors.blackGrey,
    fontWeight: '700',
  },
  displayColumn: {flexDirection: 'column'},
});

export default SendEmail;
