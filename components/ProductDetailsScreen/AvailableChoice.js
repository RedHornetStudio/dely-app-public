import React from 'react';
import { StyleSheet, View } from 'react-native';
import bigDecimal from 'js-big-decimal';

import values from '../../constants/values';
import RegularText from '../RegularText';
import MainSwitch from '../MainSwitch';

const AvailableChoice = props => {
  return (
    <View style={styles.container}>
      <View style={styles.textAndPriceContainer}>
        <RegularText style={styles.title} numberOfLines={1}>{props.availableChoice.title}</RegularText>
        {props.availableChoice.price > 0 
          ? <RegularText style={styles.price}>{`${props.currency} ${new bigDecimal(props.availableChoice.price).round(2).getValue()}`}</RegularText>
          : null
        }
      </View>
      <MainSwitch
        style={styles.switch}
        index={props.index}
        switchValues={props.switchValues}
        setSwitchValues={props.setSwitchValues}
        multiple={props.multiple}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: values.topMargin,
  },
  textAndPriceContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  title: {
    flex: 1,
  },
  price: {
    marginLeft: values.windowHorizontalPadding,
  },
  switch: {
    marginLeft: values.windowHorizontalPadding,
  },
});

export default AvailableChoice;