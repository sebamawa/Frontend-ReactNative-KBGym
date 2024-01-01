import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import Home from './Home';
import CustomersNavigation from './CustomersNavigation';
import InvoicesPerMonth from './invoices/InvoicesPerMonth';
import UpdateCustomersDebts from './debts/UpdateCustomersDebts';
import SettingComponent from './setting/SettingComponent';


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  logo: {
    width: 300,
    height: 400,
  },
});

function Home() {
    return (
        <View style={styles.container}>
            <Image
              source={ require('./assets/bluefitness-logo.png') }
              style={{width: 300, height: 300,}}
            /> 
        </View>
    );
}

function App() { 

  // const Stack = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer independent={true}>
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="Customers" component={CustomersNavigation} options={{headerShown: false}}/>
            <Tab.Screen name="Invoices" component={InvoicesPerMonth}/> 
            <Tab.Screen name="Settings" component={SettingComponent}/>
            <Tab.Screen name="Update Customers Debts" component={UpdateCustomersDebts}/> 
        </Tab.Navigator>
    </NavigationContainer>    
  );

//   return (
//     <NavigationContainer>
//         <Stack.Navigator id='stack-navigator' screenOptions={{ headerShown: false }}>
//             <Stack.Screen 
//                 name="Home" 
//                 component={Home} 
//                 //options={{ headerShown: false }}
//             />            
//             {/* <Stack.Screen 
//                 name="Customers" 
//                 component={Customers} 
//                 options={{ title: 'Customers' }}
//             /> */}
//             <Stack.Screen 
//                 name="Customer Details" 
//                 component={CustomerDetails} 
//             />
//             <Stack.Screen 
//                 name="Add Invoice" 
//                 component={AddCustomerInvoice} 
//             /> 
//             <Stack.Screen 
//                 name="Invoices Per Month" 
//                 component={InvoicesPerMonth} 
//             />             
//             <Stack.Screen 
//                 name="Customer Invoices" 
//                 component={CustomerInvoices} 
//                 options={({navigation, route}) => ({
                    
//                     headerRight: () => (
//                         <Button 
//                             icon={'plus'}
//                             onPress={() => {
//                                 //console.log(route.params.customer);
//                                 navigation.navigate('Add Invoice', {customer: route.params.customer})
//                             }}>
//                             ADD
//                         </Button>
//                     )
//                 })}
//             /> 
//             <Stack.Screen 
//                 name="Customer Debts" 
//                 component={CustomerDebts} 
//             />                            
//         </Stack.Navigator>
//     </NavigationContainer>
//   );
}

export default App;
