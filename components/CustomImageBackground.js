import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const CustomImageBackground = props => {
  return (
    <View style={styles.backgroundImageContainer} >
      <Image source={props.source} style={styles.backgroundImage} />
      <View style={[styles.overlay, { backgroundColor: props.overlayColor }]}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
});

export default CustomImageBackground;