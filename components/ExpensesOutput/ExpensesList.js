import { FlatList } from "react-native";
import ExpenseItem from "./ExpenseItem";

function renderExpenseItem(itemData) {
    //{...itemData.item} expand raw data into key value pair where the property names are used as prop names and the values are used as values for that props  i.e., passes id ,description, amount,date from ExpensesOutput 
    //we can also send it manually as{description= amount= date= }
    return <ExpenseItem {...itemData.item} />
}

function ExpensesList({ expenses }) {
    return (
        <FlatList
            data={expenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
        />
    );
}

export default ExpensesList;