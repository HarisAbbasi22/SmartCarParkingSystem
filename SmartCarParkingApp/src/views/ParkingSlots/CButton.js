import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

const CButton = ({text}) => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFD428',
    padding: 15,
    width: '46%',
    height: 60,
  },
  text: {
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
});

export default CButton;
