import { createContext, useReducer } from "react";

export const ExpensesContext = createContext({
    expenses: [],
    addExpense: ({ description, amount, date }) => { },
    setExpenses: (expenses) => { },
    deleteExpense: (id) => { },
    updateExpense: (id, { description, amount, date }) => { },
});

function expensesReducer(state, action) {
    switch (action.type) {
        case 'Add':
            //const id= new Date().toString() + Math.random().toString();     one of the way for creating uniique id's
            // return [{...action.payload, id}, ...state];
            //using id given by firebase so we pass whole action.payload
            return [action.payload, ...state];
        case 'SET':
            const inverted = action.payload.reverse(); //the data is stored in chronological order in firebase so because of this newly added data goes at bottom but we want that it come at top so we reverse it.
            return inverted;
        case 'UPDATE':
            const updatableExpenseIndex = state.findIndex(
                (expense) => expense.id === action.payload.id
            );
            const updatableExpense = state[updatableExpenseIndex];
            const updatedItem = { ...updatableExpense, ...action.payload.data };
            const updatedExpenses = [...state];
            updatedExpenses[updatableExpenseIndex] = updatedItem;
            return updatedExpenses;
        case 'DELETE':
            return state.filter((expense) => expense.id !== action.payload)
        default:
            return state;
    }
}

function ExpensesContextProvider({ children }) {
    const [expensesState, dispatch] = useReducer(expensesReducer, []);

    function addExpense(expenseData) {
        dispatch({ type: 'Add', payload: expenseData });
    };

    function setExpenses(expenses) {
        dispatch({ type: 'SET', payload: expenses });
    };

    function deleteExpense(id) {
        dispatch({ type: 'DELETE', payload: id });
    };

    function updateExpense(id, expenseData) {
        dispatch({
            type: 'UPDATE', payload: { id: id, data: expenseData },
        });
    };

    const value = {
        expenses: expensesState,
        setExpenses: setExpenses,
        addExpense: addExpense,
        deleteExpense: deleteExpense,
        updateExpense: updateExpense
    };

    return (
        <ExpensesContext.Provider value={value}>
            {children}
        </ExpensesContext.Provider>
    );
}

export default ExpensesContextProvider;