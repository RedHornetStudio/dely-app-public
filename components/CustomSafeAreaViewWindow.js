import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const CustomSafeAreaViewWindow = props => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={[styles.safeAreaViewWindow, props.windowStyle]}>
          {props.children}
        </View>
      </SafeAreaView>
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

export default CustomSafeAreaViewWindow;