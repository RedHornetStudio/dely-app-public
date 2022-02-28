import React, { useEffect, useLayoutEffect, useRef, useCallback, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../../constants/values';
import BottomLine from '../BottomLine';
import RegularText from '../RegularText';
import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';

const SectionItem = props => {

  // Fading in
  const animatedOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });

  useLayoutEffect(() => {
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, [])
  // --------------------------------------------
  
  return (
    <Animated.View style={[styles.availableSectionContainer, animatedStyle]} key={props.itemData.item.category}>
      <CustomPressableOpacity
        style={styles.availableSection}
        onPress={() => {
          clearTimeout(props.myTimeoutRef.current);
          props.navigationItemPressedRef.current = true;
          props.setVisibleCategory(props.itemData.item.category);
          props.scrolllingNavigationRef.current.scrollToIndex({ index: props.index });
          props.listRef.current.scrollToIndex({ index: props.itemData.item.categoryIndex });
          const myTimeout = setTimeout(() => {
            props.navigationItemPressedRef.current = false;
          }, 600);
          props.myTimeoutRef.current = myTimeout;
        }}
      >
      {props.visibleSectionIndex === props.index
          ? <BoldText>{props.itemData.item.category}</BoldText>
          : <RegularText>{props.itemData.item.category}</RegularText>
      }
      </CustomPressableOpacity>
    </Animated.View>
  );
};

const ScrollingNavigation = props => {

  // Showing active category
  const scrolllingNavigationRef = useRef(null);
  const myTimeoutRef = useRef(null);
  const [visibleCategory, setVisibleCategory] = useState(null);
  const visibleSection = props.availableSections.find(availableSection => availableSection.category === visibleCategory);
  const visibleSectionIndex = props.availableSections.indexOf(visibleSection);

  useEffect(() => {
    props.settingVisibleCategoryRef.current = setVisibleCategory;
  }, [])

  useEffect(() => {
    if (visibleSectionIndex >= 0) scrolllingNavigationRef.current.scrollToIndex({ index: visibleSectionIndex });
  }, [visibleCategory])

  useLayoutEffect(() => {
    if (props.availableSections[0]) setVisibleCategory(props.availableSections[0].category);
  }, [props.availableSections])
  // --------------------------------------------

  // Rendering FlatList components
  const renderItem = useCallback(itemData => {
    return (
      <SectionItem
        itemData={itemData}
        visibleSectionIndex={visibleSectionIndex}
        listRef={props.listRef}
        scrolllingNavigationRef={scrolllingNavigationRef}
        index={itemData.index}
        setVisibleCategory={setVisibleCategory}
        navigationItemPressedRef={props.navigationItemPressedRef}
        myTimeoutRef={myTimeoutRef}
      />
    );
  }, [visibleSectionIndex]);

  const keyExtractor = useCallback(item => item.category, []);
  // --------------------------------------------


  return (
    <View style={styles.scorllingNavigationContainer}>
      <BottomLine />
      <FlatList
        ref={scrolllingNavigationRef}
        horizontal={true}
        data={props.availableSections}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        initialNumToRender={props.availableSections.length + 1}
        maxToRenderPerBatch={10}
        windowSize={21}
      />
      <BottomLine />
    </View>
  );
};

const styles = StyleSheet.create({
  scorllingNavigationContainer: {
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  availableSectionContainer: {
    justifyContent: 'center',
    marginHorizontal: values.windowHorizontalPadding,
  },
});

export default ScrollingNavigation;

