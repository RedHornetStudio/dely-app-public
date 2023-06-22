import React, { memo, useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import values from '../../constants/values';
import colors from '../../constants/colors';
import RegularText from '../RegularText';
import BoldText from '../BoldText';
import CustomPressableOpacity from '../CustomPressableOpacity';

const SectionItem = memo(props => {

  // ### Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
      animatedOpacity.value = 0;
      animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
    }, [props.index])
  // ############################################

  return (
    <Animated.View style={animatedStyle}>
      <CustomPressableOpacity
        style={styles.availableSection}
        key={props.category}
        onPress={() => {
          if (props.myTimeoutRef.current) clearTimeout(props.myTimeoutRef.current);
          props.navigationItemPressedRef.current = true;
          props.setVisibleCategory(props.category);
          props.scrolllingNavigationRef.current.scrollToIndex({ index: props.index });
          props.listRef.current.scrollToIndex({ index: props.categoryIndex });
          const myTimeout = setTimeout(() => {
            props.navigationItemPressedRef.current = false;
          }, 600);
          props.myTimeoutRef.current = myTimeout;
        }}
      >
        <View style={styles.textContainer}>
          {props.active
              ? <BoldText numberOfLines={1} style={styles.text}>{props.category}</BoldText>
              : <RegularText numberOfLines={1} style={styles.text}>{props.category}</RegularText>
          }
        </View>
      </CustomPressableOpacity>
    </Animated.View>
  );
});

const ScrollingNavigation = props => {

  // ### Fading in
  const animatedOpacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedOpacity.value,
    }
  });
  useLayoutEffect(() => {
    animatedOpacity.value = 0;
    animatedOpacity.value = withTiming(1, { duration: values.animationDuration });
  }, [])
  // #################################################

  // ### Showing active category
  const scrolllingNavigationRef = useRef(null);
  const myTimeoutRef = useRef(null);
  const visibleSectionIndex = useMemo(() => {
    return props.availableSections.indexOf(props.availableSections.find(availableSection => availableSection.category === props.visibleCategory));
  }, [props.visibleCategory]);

  useEffect(() => {
    return () => {
      if (myTimeoutRef.current) clearTimeout(myTimeoutRef.current);
    };
  }, [])

  useEffect(() => {
    if (visibleSectionIndex >= 0) scrolllingNavigationRef.current.scrollToIndex({ index: visibleSectionIndex });
  }, [props.visibleCategory]);
  // ##################################################

  // ### Rendering FlatList components
  const renderItem = itemData => {
    return (
      <SectionItem
        category={itemData.item.category}
        categoryIndex={itemData.item.categoryIndex}
        active={visibleSectionIndex === itemData.index}
        listRef={props.listRef}
        scrolllingNavigationRef={scrolllingNavigationRef}
        index={itemData.index}
        setVisibleCategory={props.setVisibleCategory}
        navigationItemPressedRef={props.navigationItemPressedRef}
        myTimeoutRef={myTimeoutRef}
      />
    );
  };

  const keyExtractor = item => item.category;
  // #####################################################3

  if (props.availableSections.length > 0) {
    return (
      <Animated.View style={[styles.scorllingNavigationContainer, animatedStyle]}>
        <FlatList
          ref={scrolllingNavigationRef}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.flatListContentContainerStyle, { marginBottom: props.insetsBottom }]}
          data={props.availableSections}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={props.availableSections.length + 1}
          maxToRenderPerBatch={10}
          windowSize={21}
        />
      </Animated.View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  flatListContentContainerStyle: {
    height: 70,
  },
  scorllingNavigationContainer: {
    backgroundColor: colors.thirdColor,
  },
  availableSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: values.windowHorizontalPadding,
  },
});

export default ScrollingNavigation;

