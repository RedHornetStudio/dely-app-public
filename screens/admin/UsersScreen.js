import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import values from '../../constants/values';
import UsersScreenListHeaderComponent from '../../components/UsersScreen/UsersScreenListHeaderComponent';
import { concatErrors } from '../../shared/sharedFunctions';
import UserListItem from '../../components/UsersScreen/UserListItem';
import { getNewAccessTokenAsync } from '../../shared/sharedFunctions';
import AboveMessage from '../../components/AboveMessage';
import LoadingModal from '../../components/LoadingModal';

const UsersScreen = props => {
  console.log('----Users Screen rerendered----');

  const dispatch = useDispatch();

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Auth tokens
  const auth = useSelector(state => state.authSlice);

  // ### Loading order history data from data base
  const [users, setUsers] = useState([]);
  const [loadingErrorIndicatorState, setLoadingErrorIndicatorState] = useState({
    noItems: true,
    loading: true,
    loadingError: false,
  });

  // ### Modals
  const [userIdAndEmail, setUserIdAndEmail] = useState({ id: null, email: null });
  const [deleteUserModal, setDeleteUserModal] = useState(false);

  const [loadingModal, setLoadingModal] = useState(false);
  const [somethingWentWrongModal, setSomethingWentWrongModal] = useState(false);
  const [permissionDeniedModalVisibility, setPermissionDeniedModalVisibility] = useState(false);

  // ### Handlers
  const onConfirmDeleteUser = () => {
    (async () => {
      setLoadingModal(true);
      try {
        let res = (await axios.post(`${values.requestUrl}auth/postDeleteUser`, { accessToken: auth.accessToken, userId: userIdAndEmail.id })).data
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            res = (await axios.post(`${values.requestUrl}auth/postDeleteUser`, { accessToken: newAccessToken, userId: userIdAndEmail.id })).data
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED' && res.errors[0].msg === 'User do not exist') {
          res.status = 'SUCCESS';
        }
        if (res.status === 'FAILED') throw new Error(concatErrors(res.errors));
        setUsers(oldUsers => {
          const newUsers = [...oldUsers];
          const userIndex = newUsers.findIndex(user => user.id === userIdAndEmail.id);
          newUsers.splice(userIndex, 1);
          setLoadingErrorIndicatorState({
            noItems: newUsers.length === 0,
            loading: false,
            loadingError: false,
          });
          return newUsers;
        });
        setLoadingModal(false);
      } catch (error) {
        console.log(`Error while deleting user from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setLoadingModal(false);
          setSomethingWentWrongModal(true);
        }
      }
    })();
  };

  // ### Getting users data
  useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        let res = (await axios.post(`${values.requestUrl}auth/getUsers`, { accessToken: auth.accessToken }, { signal: controller.signal })).data
        if (res.status === 'FAILED' && res.errors[0].msg === 'Unauthorized') {
          const { success, newAccessToken } = await getNewAccessTokenAsync(auth.refreshToken, dispatch);
          if (success) {
            res = (await axios.post(`${values.requestUrl}auth/getUsers`, { accessToken: newAccessToken }, { signal: controller.signal })).data
          } else {
            props.navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BusinessSignIn' }] });
            return;
          }
        }
        if (res.status === 'FAILED') throw new Error(concatErrors(res.errors));
        setLoadingErrorIndicatorState({
          noItems: res.data.length === 0,
          loading: false,
          loadingError: false,
        });
        const collator = new Intl.Collator(appLanguage);
        res.data.sort((a, b) => collator.compare(a.email, b.email));
        setUsers(res.data);
      } catch (error) {
        console.log(`Error while loading users from database: ${error.message}`);
        if (error.message !== 'canceled') {
          setLoadingErrorIndicatorState({
            noItems: true,
            loading: false,
            loadingError: true,
          });
        }
      }
    })();

    return () => {
      if (controller) controller.abort();
    };
  }, []);
  // ##################################

  // ### Returning from AddUserScreen with new user data
  useEffect(() => {
    if (!props.route.params?.newUser) return;
    setUsers(oldUsers => {
      const newUsers = [...oldUsers];
      newUsers.push({ id: props.route.params.newUser.userId, email: props.route.params.newUser.email });
      const collator = new Intl.Collator(appLanguage);
      newUsers.sort((a, b) => collator.compare(a.email, b.email));
      setLoadingErrorIndicatorState({
        noItems: newUsers.length === 0,
        loading: false,
        loadingError: false,
      });
      return newUsers;
    });
  }, [props.route.params?.newUser]);

  // ### Rendering FlatList components
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = itemData => {
    return (
      <UserListItem
        style={styles.userListItem}
        appText={appText}
        navigation={props.navigation}
        id={itemData.item.id}
        email={itemData.item.email}
        index={itemData.index}
        setUserIdAndEmail={setUserIdAndEmail}
        setDeleteUserModal={setDeleteUserModal}
      />
    );
  };

  const getItemLayout = (data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return { length: values.userListItemHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.userListItemHeight * index, index };
  };

  const keyExtractor = item => item.id;
  // ###########################

  // ### Filtering users by search term
  const [inputText, setInputText] = useState('');
  const filteredUsersData = useMemo(() => {
    return inputText.trim().length > 0
    ? users.filter(users => users.email.toLowerCase().includes(inputText.toLowerCase().trim()))
    : users;
  }, [inputText, users]);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <UsersScreenListHeaderComponent
            shopTitle={props.route.params.shopTitle}
            imageUrl={props.route.params.shopImageUrl}
            inputText={inputText}
            setInputText={setInputText}
            loadingErrorIndicatorState={loadingErrorIndicatorState}
            filteredUsersData={filteredUsersData}
            appText={appText}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            navigation={props.navigation}
          />
        }
        data={filteredUsersData}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'always'}
        contentMinHeight={{ value: values.headerBigIconSize + values.topMargin, useWindowHeight: true, useInsetsTop: true }}
      />

      <AboveMessage
        visible={deleteUserModal}
        setModalVisibility={setDeleteUserModal}
        closeOnBackButtonPress={true}
        messageText={`${appText.areYouSureDeleteUser} "${userIdAndEmail.email}"?`}
        confirmButtonText={appText.confirm}
        onConfirm={onConfirmDeleteUser}
        cancelButtonText={appText.cancel}
      />
      <AboveMessage
        visible={somethingWentWrongModal}
        setModalVisibility={setSomethingWentWrongModal}
        closeOnBackButtonPress={true}
        messageText={appText.somethingWentWrongAndTryLater}
        confirmButtonText={appText.confirm}
      />
      <AboveMessage
        visible={permissionDeniedModalVisibility}
        setModalVisibility={setPermissionDeniedModalVisibility}
        closeOnBackButtonPress={true}
        messageText={appText.permissionDenied}
        confirmButtonText={appText.confirm}
      />
      <LoadingModal
        visible={loadingModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // ----Screen----
  screen: {
    flex: 1,
  },
  customSafeAreaFlatListWindowContentContainerStyle: {
    paddingBottom: values.topMargin,
  },
  userListItem: {
    marginHorizontal: values.windowHorizontalPadding,
  }
});

export default UsersScreen;