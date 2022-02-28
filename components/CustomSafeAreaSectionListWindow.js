import React from 'react';
import { StyleSheet, View, SectionList, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Finding last given style prop in styles array
const findStyleProp = (style, prop) => {
  if (!style) return undefined;
  let styleProp = undefined;
  const find = elems => {
    if (Array.isArray(elems)) {
      elems.forEach(elem => {
        find(elem);
      });
    } else {
      if (elems[prop]) styleProp = elems[prop];
    }
  }
  find(style);
  return styleProp;
};

const CustomSafeAreaSectionListWindow = props => {

  const insets = useSafeAreaInsets();

  // Setting FlatList minHeight
  let windowHeight = Dimensions.get('window').height;
  if (Platform.OS === 'android') windowHeight += insets.top;
  let contentMinHeight;
  if (props.contentMinHeight) {
    contentMinHeight = props.contentMinHeight.plusWindowHeight ? props.contentMinHeight.value + insets.top + windowHeight : props.contentMinHeight.value;
  }

  const paddingTop = findStyleProp(props.contentContainerStyle, 'paddingTop');
  const paddingBottom = findStyleProp(props.contentContainerStyle, 'paddingBottom');

  return (
    <View style={[styles.container, props.containerStyle]}>
        <SectionList
          {...props}
          style={props.sectionListStyle}
          contentContainerStyle={[props.contentContainerStyle, { minHeight: contentMinHeight }, { paddingTop: typeof paddingTop === 'number' ? insets.top + paddingTop : insets.top, paddingBottom: typeof paddingBottom === 'number' ? insets.bottom + paddingBottom : insets.bottom }]}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomSafeAreaSectionListWindow;