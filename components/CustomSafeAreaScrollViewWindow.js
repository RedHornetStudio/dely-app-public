import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const CustomSafeAreaScrollViewWindow = props => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <ScrollView>
        <SafeAreaView style={[styles.safeAreaView, props.safeAreaViewStyle]}>
          <View style={[styles.safeAreaViewWindow, props.windowStyle]}>
            {props.children}
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  safeAreaViewWindow: {
    flex: 1,
  },
});

export default CustomSafeAreaScrollViewWindow;