import { View, Text, StyleSheet, Image } from 'react-native';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Este es mi perro!</Text>
       <Image
        style={styles.stretch}
        source={require('../../assets/images/perro1.png')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                
    justifyContent: 'center', 
    alignItems: 'center',     
    backgroundColor: '#780000', 
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fefae0'
  },
  stretch: {
    marginTop: 40,
    width: 300,
    height: 300,
    resizeMode: 'stretch',
  }
});
