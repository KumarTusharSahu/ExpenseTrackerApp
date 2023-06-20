import { useContext, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import IconButton from '../components/UI/IconButton';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expenses-context';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import { deleteExpense, storeExpense, updateExpense } from '../util/http';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import ErrorOverlay from '../components/UI/ErrorOverlay';

function ManageExpense({ route, navigation }) {
    const [isSubmitting, setIsSubmitting]=useState(false);
    const [error,setError]=useState();

    const expensesCtx = useContext(ExpensesContext);

    const editedExpenseId = route.params?.expenseId;  //expenseId comes from ExpenseeItem.js

    //there may be a case when we load this screen without any params in that case params would be undefind and trying to access  property like expenseId which will cause an error By using ? above we check that if there are params then access this otherwise not so atlast we get expenseId if params are available and get undefined if params are not 

    //therefore if there is editedExpenseId then we are editing and if there is undefined then we are adding a new expense

    const isEditing = !!editedExpenseId; //using !! we convert it into boolean

    const selectedExpense = expensesCtx.expenses.find((expense) => expense.id === editedExpenseId);


    //array of dependencies in useEffect and useLayoutEffect selects when this function is rexecuted

    //here we see that how we can update the options of a screen from inside that screen initially we seen setting options in App.js (navigators)
    useLayoutEffect(() => {
        navigation.setOptions({
            //setting titles dynamically we see different titles on same screen depend on condition
            title: isEditing ? 'Edit Expense' : 'Add Expense',
        });
    }, [navigation, isEditing]);

    async function deleteExpenseHandler() {
        setIsSubmitting(true);
        try{
            
            await deleteExpense(editedExpenseId);
            expensesCtx.deleteExpense(editedExpenseId);
            Alert.alert('Expense Deleted', 'Expense Deleted Successfully', [
                {
                    onPress: () => navigation.goBack()
                }]);
        } catch (error){
            setError('Could not delete expense - please try again later');
            setIsSubmitting(false);
        }
    }

    function cancelHandler() {
        //return /closing manageExpenseScreen and go back to previous screen which opens it
        navigation.goBack();
    }

    async function confirmHandler(expenseData) {
        setIsSubmitting(true);
        try{
        if (isEditing) {
            expensesCtx.updateExpense(editedExpenseId, expenseData); //context is used for changing/updating locally
            await updateExpense(editedExpenseId, expenseData);                              //http requests are used for changing/updating in database
            Alert.alert('Expense Updated', 'Your Expense Updated Successfully',[
                {
                    onPress: () => navigation.goBack()
                }]);
        } else {
            const id = await storeExpense(expenseData); //sending data to firebase
            expensesCtx.addExpense({...expenseData, id:id});  //in adding first we add in database then add locally
            navigation.goBack();
        }
    } catch (error){
        setError('Could not save data - please try again later');
        setIsSubmitting(false);
    }
    }

    if(error && !isSubmitting){
        return <ErrorOverlay message={error} />
    }

    if(isSubmitting){
        return <LoadingOverlay/>
    }

    return (
        <View style={styles.container}>
            <ExpenseForm
                submitButtonLabel={isEditing ? 'Update' : 'Add'}
                onSubmit={confirmHandler}
                onCancel={cancelHandler}
                defaultValues={selectedExpense}
            />

            {isEditing && (
                <View style={styles.deleteContainer}>
                    <IconButton
                        icon="trash"
                        color={GlobalStyles.colors.error500}
                        size={36}
                        onPress={deleteExpenseHandler}
                    />
                </View>
            )}
        </View>);
}

export default ManageExpense;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: GlobalStyles.colors.primary800,
    },
    deleteContainer: {
        marginTop: 16,
        paddingTop: 8,
        borderTopWidth: 2,
        borderTopColor: GlobalStyles.colors.primary200,
        alignItems: 'center',
    },
});
