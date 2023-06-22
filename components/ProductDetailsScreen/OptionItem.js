import React, { memo, useState, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import values from '../../constants/values';
import RegularText from '../RegularText';
import AvailableChoice from './AvailableChoice';
import Badge from '../Badge';

const OptionItem = props => {
  const [switchValues, setSwitchValues] = useState(props.option.variants.map(() => false));

  useLayoutEffect(() => {
    // creating new choices on switch values change
    props.setChoices(choices => {
      const newChoices = {...choices}
      switchValues.forEach((switchValue, index) => {
        newChoices.options[props.index].userChoices[index].selected = switchValue;
      });

      let priceWithOptions = newChoices.price;
      newChoices.options.forEach(option => {
        option.userChoices.forEach((userChoice => {
          if (userChoice.selected) priceWithOptions = priceWithOptions.add(userChoice.price);
        }));
      });
      newChoices.priceWithOptions = priceWithOptions;
      return newChoices;
    });
  }, [switchValues]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <RegularText style={styles.title} numberOfLines={1}>{props.option.title}</RegularText>
        {props.option.required === 1 &&
          <Badge style={styles.badge} badgeTextStyle={styles.badgeText}>{props.appText.required}</Badge>
        }
        {props.option.multiple === 1 &&
          <Badge style={styles.badge} badgeTextStyle={styles.badgeText}>{props.appText.multiple}</Badge>
        }
      </View>
      {props.option.variants.map((availableChoice, index) => {
        return (
          <AvailableChoice
            key={availableChoice.title}
            currency={props.currency}
            availableChoice={availableChoice}
            index={index}
            switchValues={switchValues}
            setSwitchValues={setSwitchValues}
            multiple={props.option.multiple}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: values.topMargin,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: values.windowHorizontalPadding,
    fontSize: values.headerTextSize,
    maxWidth: '60%',
  },
  badge: {
    height: values.regularTextSize * 1.2,
    width: 'auto',
    marginLeft: 5,
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: values.regularTextSize / 1.5,
  },
});

export default memo(OptionItem);