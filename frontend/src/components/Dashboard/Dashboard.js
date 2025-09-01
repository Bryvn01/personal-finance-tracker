import React, { useState, useEffect } from 'react';
import { transactionsAPI, budgetsAPI } from '../../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [transactionsRes, alertsRes] = await Promise.all([
        transactionsAPI.getAll(),
        budgetsAPI.getAlerts()
      ]);

      const transactions = transactionsRes.data;
      setRecentTransactions(transactions.slice(0, 5));

      // Calculate summary
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      setSummary({
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses
      });

      setBudgetAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-3">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="mb-3">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-3 mb-3">
        <div className="card">
          <h3>Total Income</h3>
          <p className="income" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ${summary.totalIncome.toFixed(2)}
          </p>
        </div>
        
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="expense" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ${summary.totalExpenses.toFixed(2)}
          </p>
        </div>
        
        <div className="card">
          <h3>Balance</h3>
          <p 
            className={summary.balance >= 0 ? 'income' : 'expense'}
            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
          >
            ${summary.balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Recent Transactions */}
        <div className="card">
          <h3>Recent Transactions</h3>
          {recentTransactions.length === 0 ? (
            <p>No transactions yet. Add your first transaction!</p>
          ) : (
            <div>
              {recentTransactions.map(transaction => (
                <div 
                  key={transaction.id} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <div>
                    <strong>{transaction.description || 'No description'}</strong>
                    <br />
                    <small>{transaction.category_name} • {transaction.date}</small>
                  </div>
                  <span className={transaction.type}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Budget Alerts */}
        <div className="card">
          <h3>Budget Alerts</h3>
          {budgetAlerts.length === 0 ? (
            <p>No budget alerts. You're staying within your limits! 🎉</p>
          ) : (
            <div>
              {budgetAlerts.map(alert => (
                <div 
                  key={alert.id}
                  style={{ 
                    padding: '0.5rem',
                    margin: '0.5rem 0',
                    backgroundColor: alert.percentage_used >= 100 ? '#fee' : '#fff3cd',
                    border: `1px solid ${alert.percentage_used >= 100 ? '#fcc' : '#ffeaa7'}`,
                    borderRadius: '4px'
                  }}
                >
                  <strong>{alert.category_name}</strong>
                  <br />
                  <small>
                    ${alert.spent_amount} / ${alert.amount} ({alert.percentage_used}%)
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;