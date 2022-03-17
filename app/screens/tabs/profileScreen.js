import React, {useState, useContext} from 'react';
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
const colorAvatar = 'rgb(214,205,25)';

function Profile({navigation}) {
  const {logout} = useContext(AuthContext);

  const [userData, setUserData] = useState({
    firstName: 'Emanuel',
    lastName: 'Caprariu',
    email: 'test100@gmail.com',
    phone: '072123141444',
    balance: 100,
    tickets: [
      {key: '15185152d', typeTicket: '10', number: 5},
      {key: 'QRCODEDACAE', typeTicket: '20', number: 2},
      {key: 'CODERANDOMDACAE', typeTicket: '30', number: 5},
    ],
    password: '',
    re_password: '',
    colorUser: colorAvatar,
    showBalance: false,
    showTickets: false,
    showSaveButton: false,
  });
  const [settingsMode, setSettingsMode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [dataSettings, setDataSettings] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
  });

  const settingsModeHandler = () => {
    console.log(settingsMode);
    setSettingsMode(!settingsMode);
    setUserData({...userData, showSaveButton: !userData.showSaveButton});
  };

  const showHideBalanceHandler = () => {
    setUserData({
      ...userData,
      showBalance: !userData.showBalance,
    });
  };

  const showHideTicketsHandler = () => {
    if (userData.tickets.length === 0) {
      ToastAndroid.show('Nu aveti cupoane disponibile!', ToastAndroid.CENTER);
    } else {
      setUserData({
        ...userData,
        showTickets: !userData.showTickets,
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
    setChangePassword(!changePassword);
    setUserData({...userData, showSaveButton: true});
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
      showSaveButton: false,
    });
    setChangePassword(false);
    setSettingsMode(false);
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
                Sold: {userData.showBalance ? userData.balance : '****'} RON
              </Text>
              <TouchableOpacity
                onPress={() => showHideBalanceHandler()}
                activeOpacity={0.5}>
                <Icon
                  name={userData.showBalance ? 'eye' : 'eye-off'}
                  type={'feather'}
                  color={colors.white}
                  size={24}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => logoutHandler()}
              activeOpacity={0.8}>
              <UserField
                widthStyle={120}
                colorBackground={colors.blackGrey}
                nameIcon={'exit-outline'}
                typeIcon={'ionicon'}
                labelField={'Logout'}
                sizeIcon={26}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.userProfile}>
            <View style={styles.userDataInfo}>
              <Text style={styles.textLabel}>Date personale</Text>
              {!settingsMode ? (
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
              {changePassword ? (
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
                    arrowName={!userData.showTickets ? 'arrowup' : 'arrowdown'}
                    typeIcon={'material-community'}
                    labelField={'Cupoanele mele'}
                    sizeIcon={26}
                    updown={true}
                  />
                  {/* </TouchableOpacity> */}
                </CollapseHeader>
                <CollapseBody>
                  {userData.tickets.map(item => {
                    switch (item.typeTicket) {
                      case '10':
                        return (
                          <UserField
                            nameIcon={'numeric-1-box-outline'}
                            nameIcon2={'numeric-0-box-outline'}
                            typeIcon={'material-community'}
                            labelField={
                              'Cupon ' + item.typeTicket + '% reducere'
                            }
                            sizeIcon={26}
                            dataField={'Total:' + item.number}
                            buttonStyle={styles.buttonStyle}
                            typeOfTicket={item.typeTicket}
                          />
                        );
                      case '20':
                        return (
                          <UserField
                            nameIcon={'numeric-2-box-outline'}
                            nameIcon2={'numeric-0-box-outline'}
                            typeIcon={'material-community'}
                            labelField={
                              'Cupon ' + item.typeTicket + '% reducere'
                            }
                            sizeIcon={26}
                            dataField={'Total:' + item.number}
                            buttonStyle={styles.buttonStyle}
                            typeOfTicket={item.typeTicket}
                          />
                        );
                      case '30':
                        return (
                          <UserField
                            nameIcon={'numeric-3-box-outline'}
                            nameIcon2={'numeric-0-box-outline'}
                            typeIcon={'material-community'}
                            labelField={
                              'Cupon ' + item.typeTicket + '% reducere'
                            }
                            sizeIcon={26}
                            dataField={'Total:' + item.number}
                            buttonStyle={styles.buttonStyle}
                            typeOfTicket={item.typeTicket}
                          />
                        );
                    }
                  })}
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

            {userData.showSaveButton ? (
              <>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                    marginTop: -10,
                  }}>
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
    flex: 1,
    marginRight: width - 160,
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
    marginLeft: width - 160,
  },
  userProfile: {
    paddingTop: 10,
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
});
export default Profile;
