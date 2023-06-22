import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { findStyleProp } from '../shared/sharedFunctions';

const CustomSafeAreaScrollViewWindowWithInsets = props => {

  const insets = useSafeAreaInsets();
  const windowHeight = useWindowDimensions().height;

  // Setting ScrollView minHeight and setting insets with padding
  const contentMinHeight = useMemo(() => {
    let height = windowHeight;
    if (Platform.OS === 'android') height += insets.top;
    let contentMinHeight;
    if (props.contentMinHeight) {
      contentMinHeight = props.contentMinHeight.value;
      if (props.contentMinHeight.useWindowHeight) contentMinHeight += height;
      if (props.contentMinHeight.useInsetsTop) contentMinHeight += insets.top;
    }
    return contentMinHeight;
  }, [insets, windowHeight, props.contentMinHeight]);
  const paddingTopPlusInsetsTop = useMemo(() => {
    const insetsTop = props.doNotUseInsetsTop ? 0 : insets.top;
    const paddingTop = findStyleProp(props.contentContainerStyle, 'paddingTop');
    return typeof paddingTop === 'number' ? insetsTop + paddingTop : insetsTop;
  }, [insets, props.doNotUseInsetsTop, props.contentContainerStyle]);
  const paddingBottomPlusInsetBottom = useMemo(() => {
    const insetsBottom = props.doNotUseInsetsBottom ? 0 : insets.bottom;
    const paddingBottom = findStyleProp(props.contentContainerStyle, 'paddingBottom');
    return typeof paddingBottom === 'number' ? insetsBottom + paddingBottom : insetsBottom;
  }, [insets, props.doNotUseInsetsBottom, props.contentContainerStyle]);

  return (
    <ScrollView
      {...props}
      contentContainerStyle={[
        props.contentContainerStyle,
        { minHeight: contentMinHeight },
        { paddingTop: paddingTopPlusInsetsTop, paddingBottom: paddingBottomPlusInsetBottom }
      ]}>
      {props.children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({

});

export default CustomSafeAreaScrollViewWindowWithInsets;