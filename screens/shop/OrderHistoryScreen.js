import React, { useEffect, useState, useRef, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import axios from 'axios';

import colors from '../../constants/colors';
import getLocalizedText from '../../constants/getLocalizedText';
import CustomImageBackground from '../../components/CustomImageBackground';
import CustomSafeAreaFlatListWindow from '../../components/CustomSafeAreaFlatListWindow';
import values from '../../constants/values';
import OrderHistoryScreenListHeaderComponent from '../../components/OrderHistoryScreen/OrderHistoryScreenListHeaderComponent';
import { concatErrors } from '../../shared/sharedFunctions';
import OrderHistoryListItem from '../../components/OrderHistoryScreen/OrderHistoryListItem';

const OrderHistoryScreen = props => {
  console.log('----Order History Screen rerendered----')

  // ### Getting localized text from global state
  const appLanguage = useSelector(state => state.appSettingsSlice.appLanguage);
  const appText = useMemo(() => {
    return getLocalizedText(appLanguage);
  }, [appLanguage]);

  // ### Getting order history from global state
  const orderHistoryString = useSelector(state => state.ordersHistorySlice.ordersHistory);
  const orderHistory = useMemo(() => {
    return JSON.parse(orderHistoryString);
  }, [orderHistoryString]);

  // ### Loading order history data from data base
  const [orders, setOrders] = useState([]);
  const [loadingErrorIndicatorState, setLoadingErrorIndicatorState] = useState({
    noItems: true,
    loading: true,
    loadingError: false,
  });

  useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        const res = (await axios.post(`${values.requestUrl}getOrderHistory`, { orderHistory: orderHistory }, { signal: controller.signal })).data
        if (res.status === 'FAILED') throw new Error(concatErrors(res.errors));
        setLoadingErrorIndicatorState({
          noItems: res.data.length === 0,
          loading: false,
          loadingError: false,
        });
        const collator = new Intl.Collator(appLanguage);
        res.data.sort((a, b) => {
          if (a.order_generation_time > b.order_generation_time) {
            return -1;
          }
          if (a.order_generation_time < b.order_generation_time) {
            return 1;
          }
          return 0;
        });
        res.data.forEach(order => {
          const creationDate = new Date(order.order_generation_time);
          const creationDateString = creationDate.getDate().toString();
          const date = creationDateString.length === 1 ? `0${creationDateString}` : creationDateString;
          const creationMonthString = (creationDate.getMonth() + 1).toString();
          const month = creationMonthString.length === 1 ? `0${creationMonthString}` : creationMonthString;
          const creationYearString = creationDate.getFullYear().toString();
          let year;
          switch(creationYearString.length) {
            case 1:
              year = `000${creationYearString}`
              break;
            case 2:
              year = `00${creationYearString}`
              break;
            case 3:
              year = `0${creationYearString}`
              break;
            default:
              year = creationYearString;
          }
          const creationHourString = new Date(creationDate).getHours().toString();
          const hours = creationHourString.length === 1 ? `0${creationHourString}` : creationHourString;
          const creationMinutesString = new Date(creationDate).getMinutes().toString();
          const minutes = creationMinutesString.length === 1 ? `0${creationMinutesString}` : creationMinutesString;
          const orderDate = `${date}.${month}.${year} ${hours}:${minutes}`;
          order.order_generation_time = orderDate;
        });
        setOrders(res.data);
      } catch (error) {
        console.log(`Error while loading order history from database: ${error.message}`);
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
  }, [orderHistory]);
  // ##################################

  // ### Rendering FlatList components
  const listHeaderComponentHeightRef = useRef(0);
  const insets = useSafeAreaInsets();

  const renderItem = itemData => {
    return (
      <OrderHistoryListItem
        appText={appText}
        navigation={props.navigation}
        id={itemData.item.id}
        order_number={itemData.item.order_number}
        order_generation_time={itemData.item.order_generation_time}
        delivery_method={itemData.item.delivery_method}
        index={itemData.index}
      />
    );
  };

  const getItemLayout = (data, index) => {
    if (index < 0) return { length: 0, offset: 0, index };
    return { length: values.orderHistoryListItemHeight, offset: insets.top + listHeaderComponentHeightRef.current + values.orderHistoryListItemHeight * index, index };
  };

  const keyExtractor = item => item.id;
  // ###########################

  // ### Filtering orders by search term
  const [inputText, setInputText] = useState('');
  const filteredOrdersData = useMemo(() => {
    return inputText.trim().length > 0
      ? orders.filter(order => order.order_number.toLowerCase().includes(inputText.toLowerCase().trim()))
      : orders;
  }, [inputText, orders]);

  return (
    <View style={styles.screen}>
      <CustomImageBackground source={require('../../assets/img/mainBackground.jpg')} overlayColor={colors.backgroundOverlayColor} />
      <CustomSafeAreaFlatListWindow
        contentContainerStyle={styles.customSafeAreaFlatListWindowContentContainerStyle}
        ListHeaderComponent={
          <OrderHistoryScreenListHeaderComponent
            inputText={inputText}
            setInputText={setInputText}
            loadingErrorIndicatorState={loadingErrorIndicatorState}
            filteredOrdersData={filteredOrdersData}
            appText={appText}
            listHeaderComponentHeightRef={listHeaderComponentHeightRef}
            navigation={props.navigation}
          />
        }
        data={filteredOrdersData}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={21}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'always'}
        contentMinHeight={{ value: values.headerBigIconSize + values.topMargin, useWindowHeight: true, useInsetsTop: true }}
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
    paddingHorizontal: values.windowHorizontalPadding,
    paddingBottom: values.topMargin,
  },
});

export default OrderHistoryScreen;