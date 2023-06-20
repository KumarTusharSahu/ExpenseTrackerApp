import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { GlobalStyles } from './constants/styles';

import RecentExpenses from './screens/RecentExpenses';
import ManageExpense from './screens/ManageExpense';
import AllExpenses from './screens/AllExpenses';
import IconButton from './components/UI/IconButton';
import ExpensesContextProvider from './store/expenses-context';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function ExpensesOverview() {
  return (
    <BottomTabs.Navigator
    //normally we pass object in screenOptions here we pass function so that we click on + icon we navigate to ManageItem screen // OR // we can not changing it to function and use useNavigation hook 
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: 'white',
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        //Adding headerIcon method 2 another method is using tabBarIcon in options as discussed in navigation section
        headerRight:({tintColor})=> <IconButton icon="add" size={24} color={tintColor} onPress={()=>{
          navigation.navigate('ManageExpense');
        }}/>
      })}>
      <BottomTabs.Screen
        name="RecentExpenses"
        component={RecentExpenses}
        options={{
          title:"Recent Expenses",
          tabBarLabel:'Recent',
          //using {color,size} expo automatically set color and size we can also escape this and write hard coded values
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" color={color} size={size}
            
            />
          )
        }}
      />
      <BottomTabs.Screen
        name="AllExpenses"
        component={AllExpenses}
        options={{
          title:"All Expenses",
          tabBarLabel:'All Expenses',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          )
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <ExpensesContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle:{backgroundColor:GlobalStyles.colors.primary500},
          headerTintColor:'white'
        }}
        >
          <Stack.Screen
            name="ExpensesOverview"
            component={ExpensesOverview}
            options={{
              headerShown: false,
            }
            }
          />
          <Stack.Screen 
            name="ManageExpense" 
            component={ManageExpense}
            options={{
              presentation:'modal', //how the screen will be loaded
            }}
             />
        </Stack.Navigator>
      </NavigationContainer>
      </ExpensesContextProvider>
    </>
  );
}

