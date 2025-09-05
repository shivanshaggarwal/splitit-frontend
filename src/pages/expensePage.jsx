import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Table, ToggleButtonGroup, ToggleButton, Container } from 'react-bootstrap';
import { getGroupExpenses, getFriendExpenses,fetchAllExpenses } from '../features/expenses/expenseSlice.js';
import AddExpenseForm from '../components/AddExpenseForm';

const ExpensesPage = () => {
  const dispatch = useDispatch();

  const { expenses, lastAddedType } = useSelector((state) => state.expenses);

  const [filter, setFilter] = useState(lastAddedType || 'all');

  useEffect(() => {
    // dispatch(getGroupExpenses());
    // dispatch(fetchFriendExpenses());
    console.log('calling');
    dispatch(fetchAllExpenses());
    console.log(expenses);
  }, [dispatch]);


  // Attach a 'type' to each expense based on presence of group
  const enrichedExpenses = expenses.map(exp => ({
    ...exp,
    type: exp.group ? 'group' : 'friend'
  }));

   
    const filteredExpenses = enrichedExpenses
    .filter(exp => (filter==='all' || exp.type === filter))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // sort by newest first
  const handleToggle = (val) => {
    setFilter(val);
  };

  return (
    <>
      <Container className="mt-4 ">
        <h2 className="mb-4">Your Expenses</h2>
        
        <AddExpenseForm />

        <div className="my-3">
          <ToggleButtonGroup type="radio" name="filter" value={filter} onChange={handleToggle}>
            <ToggleButton id="all-toggle" value="all" variant="outline-primary">
              All
            </ToggleButton>
            <ToggleButton id="group-toggle" value="group" variant="outline-primary">
              Group
            </ToggleButton>
            <ToggleButton id="friend-toggle" value="friend" variant="outline-primary">
              Friend
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Payer</th>
              <th>Split Between</th>
              <th>Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length!=0 && filteredExpenses.map((expense) => (
              <tr key={expense._id}>
                <td>{expense.description}</td>
                <td>₹{expense.amount.toFixed(2)}</td>
                <td>{expense.paidBy?.name || 'Unknown'}</td>
                <td>
                  {expense.splitBetween?.map(user => user.name).join(', ') || (expense.group?.name || '')}
                </td>
                <td>{new Date(expense.createdAt).toLocaleDateString('en-GB')}</td>
                <td>{expense.type}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default ExpensesPage;
