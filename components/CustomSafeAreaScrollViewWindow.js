import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomSafeAreaScrollViewWindow = props => {

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

  return (
    <ScrollView
      {...props}
      contentContainerStyle={[
        props.contentContainerStyle,
        { minHeight: contentMinHeight }
      ]}>
      <SafeAreaView>
        {props.children}
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

});

export default CustomSafeAreaScrollViewWindow;