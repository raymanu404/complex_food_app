import React, {useState, useContext, useEffect, useCallback} from 'react';
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
  TouchableHighlight,
  FlatList,
  Alert,
  ToastAndroid,
  ImageBackground,
  Keyboard,
} from 'react-native';
import {AuthContext} from '../../../config/context';
import {UserContext} from '../../../App';
import api_axios from '../../../config/api/api_axios';
import UserField from '../../components/UserField';
import colors from '../../../config/colors/colors';
import {Avatar, Icon} from 'react-native-elements';
import randomColor from 'randomcolor';
import {ScrollView} from 'react-native-gesture-handler';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from 'accordion-collapse-react-native';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;
const menu_container_width = 300;
const colorAvatar = randomColor();

function Profile({navigation}) {
  const {logout} = useContext(AuthContext);
  const [userDataLogin, setUserDataLogin] = useContext(UserContext);
  var [dataFromAPI, setDataFromAPI] = useState({});

  useEffect(() => {
    const getUserDataFromApi = async () => {
      try {
        let headers = {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        };
        const response = await api_axios.get(
          `/buyers/${userDataLogin.id || 2}`,
          headers,
        );

        const responseCoupons = await api_axios.get(
          `/coupons/${userDataLogin.id || 1}`,
          headers,
        );
        const userDataFromApi = {
          userData: response.data,
          coupons: responseCoupons.data,
        };
        console.log(userDataFromApi);
        //preluate si lista de cupoane
        setDataFromAPI(userDataFromApi);
      } catch (error) {
        console.log(error);
      }
    };

    getUserDataFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [userData, setUserData] = useState({
    // eslint-disable-next-line no-bitwise
    firstName: userDataLogin.firstName || 'Emanuel',
    lastName: userDataLogin.lastName || 'Caprariu',
    email: userDataLogin.email || 'test@email.com',
    phone: userDataLogin.phonenumber || '072908231',
    gender: userDataLogin.gender || 'M',
    id: userDataLogin.id || 2,
    balance: userDataLogin.balance || 0,
    tickets: [
      {
        key: '15185152d',
        type: 1,
        number:
          Array.from(userDataLogin.coupons || []).filter(x => x.type === 1)
            .length || 0,
      },
      {
        key: 'QRCODEDACAE',
        type: 2,
        number:
          Array.from(userDataLogin.coupons || []).filter(x => x.type === 2)
            .length || 0,
      },
      {
        key: 'CODERANDOMDACAE',
        type: 3,
        number:
          Array.from(userDataLogin.coupons || []).filter(x => x.type === 3)
            .length || 0,
      },
    ],
    password: userDataLogin.password || '',
    re_password: '',
    colorUser: colorAvatar,
  });

  const [settingsMode, setSettingsMode] = useState({
    showBalance: false,
    showTickets: false,
    showSaveButton: false,
    showSettingsMode: false,
    showChangePassword: false,
  });

  const [dataSettings, setDataSettings] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
  });

  const settingsModeHandler = () => {
    // setSettingsMode({
    //   ...settingsMode,
    //   showSaveButton: !settingsMode.showSaveButton,
    //   showSettingsMode: !settingsMode.showSettingsMode,
    //   showChangePassword: false,
    // });

    if (settingsMode.showSettingsMode) {
      setSettingsMode({
        ...settingsMode,
        showSaveButton: false,
        showSettingsMode: false,
        showChangePassword: false,
      });
    } else {
      setSettingsMode({
        ...settingsMode,
        showSaveButton: true,
        showSettingsMode: true,
        showChangePassword: false,
      });
    }
  };

  const showHideBalanceHandler = () => {
    setSettingsMode({
      ...settingsMode,
      showBalance: !settingsMode.showBalance,
    });
  };

  const showToastWithGravity = message => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const showHideTicketsHandler = () => {
    var total = 0;
    userData.tickets.forEach(x => {
      if (x.number > 0) {
        total += x.number;
      }
    });
    if (total === 0) {
      showToastWithGravity('Nu aveti cupoane disponibile!');
    } else {
      setSettingsMode({
        ...userData,
        showTickets: !settingsMode.showTickets,
      });
    }
  };

  const logoutHandler = () => {
    Alert.alert('Iesire din aplicatie', 'Doriti sa continuati?', [
      {
        text: 'DA',
        onPress: () => logout(),
        style: 'default',
      },
      {
        text: 'NU',
        onPress: () => console.log('logout'),
        style: 'cancel',
      },
    ]);
  };

  const changePasswordHandler = () => {
    if (settingsMode.showSettingsMode) {
      setSettingsMode({
        ...settingsMode,
        showSaveButton: true,
        showChangePassword: !settingsMode.showChangePassword,
      });
    } else {
      setSettingsMode({
        ...settingsMode,
        showSaveButton: !settingsMode.showSaveButton,
        showChangePassword: !settingsMode.showChangePassword,
      });
    }
  };

  const depunereHandler = () => {
    navigation.navigate('PayDeskScreen');
  };

  const saveSettingsHandler = () => {
    setUserData({
      ...userData,
      firstName: dataSettings.firstName,
      lastName: dataSettings.lastName,
      email: dataSettings.email,
      phone: dataSettings.phone,
    });
    setSettingsMode({
      ...settingsMode,
      showSaveButton: false,
      showSettingsMode: false,
      showChangePassword: false,
    });
    ToastAndroid.show(
      'Datele au fost modificate cu success!',
      ToastAndroid.CENTER,
    );
  };

  const changeFirstNameValue = childdata => {
    setDataSettings({...dataSettings, firstName: childdata});
  };
  const changeLastNameValue = childdata => {
    setDataSettings({...dataSettings, lastName: childdata});
  };
  const changeEmailValue = childdata => {
    setDataSettings({...dataSettings, email: childdata});
  };
  const changePhoneValue = childdata => {
    setDataSettings({...dataSettings, phone: childdata});
  };

  const renderTicket = ({item, index}) => (
    <UserField
      nameIcon={
        item.typeTicket === '10'
          ? 'numeric-1-box-outline'
          : item.typeTicket === '20'
          ? 'numeric-2-box-outline'
          : 'numeric-3-box-outline'
      }
      nameIcon2={'numeric-0-box-outline'}
      typeIcon={'material-community'}
      labelField={'Cupon ' + item.typeTicket + '% reducere'}
      sizeIcon={26}
      dataField={'Total:' + item.number}
      buttonStyle={styles.buttonStyle}
      typeOfTicket={item.typeTicket}
    />
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar
            size={120}
            rounded
            title={
              userData.firstName.charAt(0) + '' + userData.lastName.charAt(0)
            }
            containerStyle={{backgroundColor: userData.colorUser}}
          />
        </View>
        <View style={styles.header}>
          <View style={styles.editProfile}>
            <TouchableOpacity
              onPress={() => settingsModeHandler()}
              activeOpacity={0.8}>
              <UserField
                widthStyle={150}
                colorBackground={colors.blackGrey}
                nameIcon={'settings-outline'}
                typeIcon={'ionicon'}
                labelField={'Setari'}
                sizeIcon={16}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerRight}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={styles.text_balance}>
                SOLD:{' '}
                {settingsMode.showBalance
                  ? `${Number(userData.balance).toFixed(2)}`
                  : '****'}{' '}
                RON
              </Text>
              <TouchableOpacity
                onPress={() => showHideBalanceHandler()}
                activeOpacity={0.5}>
                <Icon
                  name={settingsMode.showBalance ? 'eye' : 'eye-off'}
                  type={'feather'}
                  color={colors.white}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.logoutButton}>
              <TouchableOpacity
                onPress={() => logoutHandler()}
                activeOpacity={0.8}>
                <UserField
                  widthStyle={130}
                  colorBackground={colors.blackGrey}
                  nameIcon={'exit-outline'}
                  typeIcon={'ionicon'}
                  labelField={'Logout'}
                  sizeIcon={26}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.userProfile}>
            <View style={styles.userDataInfo}>
              <Text style={styles.textLabel}>Date personale</Text>
              {!settingsMode.showSettingsMode ? (
                <>
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.blackGrey}
                    nameIcon={'user'}
                    typeIcon={'antdesign'}
                    labelField={'Nume'}
                    dataField={userData.firstName + ' ' + userData.lastName}
                  />
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.blackGrey}
                    nameIcon={'mail'}
                    typeIcon={'antdesign'}
                    labelField={'Email'}
                    dataField={userData.email}
                  />
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.blackGrey}
                    nameIcon={'phone'}
                    typeIcon={'antdesign'}
                    labelField={'Telefon'}
                    dataField={userData.phone}
                  />
                </>
              ) : (
                <>
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.black20}
                    nameIcon={'user'}
                    typeIcon={'antdesign'}
                    labelField={'Prenume'}
                    dataField={userData.firstName}
                    value={userData.firstName}
                    settingsMode={true}
                    changeTextInput={changeFirstNameValue}
                  />
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.black20}
                    nameIcon={'user'}
                    typeIcon={'feather'}
                    labelField={'Nume'}
                    dataField={userData.lastName}
                    value={userData.lastName}
                    settingsMode={true}
                    changeTextInput={changeLastNameValue}
                  />
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.black20}
                    nameIcon={'mail'}
                    typeIcon={'antdesign'}
                    labelField={'Email'}
                    dataField={userData.email}
                    value={userData.email}
                    settingsMode={true}
                    changeTextInput={changeEmailValue}
                  />
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.black20}
                    nameIcon={'phone'}
                    typeIcon={'antdesign'}
                    labelField={'Telefon'}
                    dataField={userData.phone}
                    value={userData.phone}
                    settingsMode={true}
                    phoneType={true}
                    changeTextInput={changePhoneValue}
                  />
                </>
              )}
            </View>
            <View style={styles.userDataInfo}>
              <Text style={styles.textLabel}>Setari Cont</Text>

              <TouchableOpacity
                onPress={() => changePasswordHandler()}
                activeOpacity={0.8}>
                <UserField
                  widthStyle={width - 30}
                  colorBackground={colors.blackGrey}
                  nameIcon={'lock-open-outline'}
                  typeIcon={'ionicon'}
                  labelField={'Schimbare Parola'}
                />
              </TouchableOpacity>
              {settingsMode.showChangePassword ? (
                <>
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.black20}
                    nameIcon={'lock-closed-outline'}
                    typeIcon={'ionicon'}
                    labelField={'Parola veche'}
                    dataField={'parola veche'}
                    value={userData.password}
                    settingsMode={true}
                    changeTextInput={changePhoneValue}
                    passwordType={true}
                  />
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.black20}
                    nameIcon={'lock-open-outline'}
                    typeIcon={'ionicon'}
                    labelField={'Parola noua'}
                    dataField={'parola noua'}
                    value={userData.password}
                    settingsMode={true}
                    changeTextInput={changePhoneValue}
                    passwordType={true}
                  />
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.black20}
                    nameIcon={'lock-open-outline'}
                    typeIcon={'ionicon'}
                    labelField={'Confirmare parola'}
                    dataField={'confirmare parola'}
                    value={userData.re_password}
                    settingsMode={true}
                    changeTextInput={changePhoneValue}
                    passwordType={true}
                  />
                </>
              ) : null}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => depunereHandler()}>
                <UserField
                  widthStyle={width - 30}
                  colorBackground={colors.blackGrey}
                  nameIcon={'creditcard'}
                  typeIcon={'antdesign'}
                  labelField={'Depunere'}
                />
              </TouchableOpacity>
              <Collapse onToggle={() => showHideTicketsHandler()}>
                <CollapseHeader>
                  {/* <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => showHideTicketsHandler()}> */}
                  <UserField
                    widthStyle={width - 30}
                    colorBackground={colors.blackGrey}
                    nameIcon={'ticket-outline'}
                    arrowName={
                      !settingsMode.showTickets ? 'arrowup' : 'arrowdown'
                    }
                    typeIcon={'material-community'}
                    labelField={'Cupoanele mele'}
                    sizeIcon={26}
                    updown={true}
                  />
                  {/* </TouchableOpacity> */}
                </CollapseHeader>
                <CollapseBody key={Math.random()}>
                  {settingsMode.showTickets
                    ? userData.tickets.map((item, index) => {
                        switch (item.type) {
                          case 1:
                            return (
                              <UserField
                                nameIcon={'numeric-1-box-outline'}
                                nameIcon2={'numeric-0-box-outline'}
                                typeIcon={'material-community'}
                                labelField={
                                  'Cupon ' + item.type + '0 % reducere'
                                }
                                sizeIcon={26}
                                dataField={'Total:' + item.number}
                                buttonStyle={styles.buttonStyle}
                                typeOfTicket={item.type}
                              />
                            );
                          case 2:
                            return (
                              <UserField
                                nameIcon={'numeric-2-box-outline'}
                                nameIcon2={'numeric-0-box-outline'}
                                typeIcon={'material-community'}
                                labelField={
                                  'Cupon ' + item.type + '0 % reducere'
                                }
                                sizeIcon={26}
                                dataField={'Total:' + item.number}
                                buttonStyle={styles.buttonStyle}
                                typeOfTicket={item.type}
                              />
                            );
                          case 3:
                            return (
                              <UserField
                                nameIcon={'numeric-3-box-outline'}
                                nameIcon2={'numeric-0-box-outline'}
                                typeIcon={'material-community'}
                                labelField={
                                  'Cupon ' + item.type + '0 % reducere'
                                }
                                sizeIcon={26}
                                dataField={'Total:' + item.number}
                                buttonStyle={styles.buttonStyle}
                                typeOfTicket={item.type}
                              />
                            );
                        }
                      })
                    : null}
                  {/* {userData.showTickets ? (
                    <FlatList
                      renderItem={renderTicket}
                      data={userData.tickets}
                      keyExtractor={item => item.key}
                    />
                  ) : null} */}
                </CollapseBody>
              </Collapse>
            </View>

            {settingsMode.showSaveButton ? (
              <>
                <View style={styles.settingsModeContainer}>
                  <TouchableOpacity
                    onPress={() => saveSettingsHandler()}
                    activeOpacity={0.8}>
                    <UserField
                      widthStyle={150}
                      colorBackground={colors.blackGrey}
                      nameIcon={'save-outline'}
                      typeIcon={'ionicon'}
                      labelField={'Salveaza'}
                      sizeIcon={16}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundCategories,
    marginBottom: 60,
  },
  avatarContainer: {
    zIndex: 1,
    marginTop: 10,
    marginBottom: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editProfile: {
    // flex: 1,
    // marginRight: width - 160,
    top: 5,
    left: 10,
    position: 'absolute',
    zIndex: 10,
  },
  header: {
    flex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: height * 0.7,
    backgroundColor: colors.backgroundButtonActive,
  },
  headerRight: {
    top: 5,
    right: 10,
    position: 'absolute',
    zIndex: 10,
  },
  userProfile: {
    marginTop: 50,
  },
  text_balance: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    paddingRight: 10,
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 30,
    height: 40,
    borderRadius: 10,
    marginTop: 3,
    marginBottom: 3,
    backgroundColor: colors.blackGrey,
  },
  userDataInfo: {
    flex: 1,
    marginBottom: 10,
  },
  textLabel: {
    marginTop: 10,
    textAlign: 'left',
    fontSize: 20,
    color: colors.black,
    fontWeight: '500',
  },
  settingsModeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: -10,
  },
  logoutButton: {
    right: 4,
    position: 'absolute',
    top: 20,
    zIndex: 15,
  },
});
export default Profile;
