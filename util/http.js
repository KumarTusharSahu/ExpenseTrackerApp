import axios from "axios";

const BACKEND_URL = 'https://react-native-course-fe1c1-default-rtdb.firebaseio.com'

export async function storeExpense(expenseData) {
    //post request for creating a new data in database
    const response = await axios.post( BACKEND_URL + '/expenses.json', expenseData );
    const id = response.data.name; //firebase generate these type of unique id (-NYMIYPGDs-8LVG9UPCC) and called it as name not id
    return id;
}

//sending an http request is an asynchronous task i.e. it doesn't complete immediately thats why post and get returns promises

//promise is an object that gives you access eventually to some other data
//so we use .then or async/await which is more modern

export async function fetchExpenses(){
    //get request for fetching data from firebase
    const response = await axios.get(BACKEND_URL + '/expenses.json');

    const expenses = [];

    for (const key in response.data){
        const expenseObj  = {
            id: key,
            amount: response.data[key].amount,
            date: new Date(response.data[key].date),
            description: response.data[key].description
        };
        expenses.push(expenseObj);
    }

    return expenses;
}

export function updateExpense(id, expenseData){
    return axios.put(BACKEND_URL + `/expenses/${id}.json`, expenseData);
}

export function deleteExpense(id){
    return axios.delete(BACKEND_URL + `/expenses/${id}.json`);
}
