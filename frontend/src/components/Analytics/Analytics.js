import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { transactionsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Authorization check
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchAnalytics();
    fetchMonthlyTrends();
  }, [selectedMonth, selectedYear]);

  const fetchAnalytics = async () => {
    try {
      const response = await transactionsAPI.getAnalytics(selectedMonth, selectedYear);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchMonthlyTrends = async () => {
    try {
      const months = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date(selectedYear, selectedMonth - 1 - i, 1);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const response = await transactionsAPI.getAnalytics(month, year);
        months.unshift({
          month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
          data: response.data
        });
      }
      setMonthlyData(months);
    } catch (error) {
      console.error('Error fetching monthly trends:', error);
    }
  };

  // Prepare data for expense pie chart
  const expenseData = analyticsData.filter(item => item.type === 'expense');
  const pieChartData = {
    labels: expenseData.map(item => item.name),
    datasets: [{
      data: expenseData.map(item => item.total),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
      ],
      borderWidth: 2
    }]
  };

  // Prepare data for income vs expense bar chart
  const incomeTotal = analyticsData
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.total, 0);
  const expenseTotal = analyticsData
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.total, 0);

  const barChartData = {
    labels: ['Income', 'Expenses'],
    datasets: [{
      label: 'Amount ($)',
      data: [incomeTotal, expenseTotal],
      backgroundColor: ['#28a745', '#dc3545'],
      borderWidth: 1
    }]
  };

  // Prepare data for monthly trends line chart
  const lineChartData = {
    labels: monthlyData.map(month => month.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map(month => 
          month.data.filter(item => item.type === 'income')
            .reduce((sum, item) => sum + item.total, 0)
        ),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: monthlyData.map(month => 
          month.data.filter(item => item.type === 'expense')
            .reduce((sum, item) => sum + item.total, 0)
        ),
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div>
      <h1 className="mb-3">Analytics & Insights</h1>

      {/* Month/Year Selector */}
      <div className="card mb-3">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label>View Analytics for:</label>
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({length: 12}, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({length: 5}, (_, i) => (
              <option key={selectedYear - 2 + i} value={selectedYear - 2 + i}>
                {selectedYear - 2 + i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-3 mb-3">
        <div className="card">
          <h3>Total Income</h3>
          <p className="income" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ${incomeTotal.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="expense" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ${expenseTotal.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <h3>Net Income</h3>
          <p 
            className={incomeTotal - expenseTotal >= 0 ? 'income' : 'expense'}
            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
          >
            ${(incomeTotal - expenseTotal).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2 mb-3">
        {/* Expense Breakdown Pie Chart */}
        <div className="card">
          <h3>Expense Breakdown</h3>
          {expenseData.length > 0 ? (
            <div style={{ height: '300px' }}>
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          ) : (
            <p>No expense data available for this period.</p>
          )}
        </div>

        {/* Income vs Expenses Bar Chart */}
        <div className="card">
          <h3>Income vs Expenses</h3>
          <div style={{ height: '300px' }}>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Monthly Trends Line Chart */}
      <div className="card">
        <h3>6-Month Trend</h3>
        {monthlyData.length > 0 ? (
          <div style={{ height: '400px' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        ) : (
          <p>Loading trend data...</p>
        )}
      </div>

      {/* Category Breakdown Table */}
      {analyticsData.length > 0 && (
        <div className="card mt-3">
          <h3>Category Breakdown</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((item, index) => {
                const total = analyticsData
                  .filter(d => d.type === item.type)
                  .reduce((sum, d) => sum + d.total, 0);
                const percentage = ((item.total / total) * 100).toFixed(1);
                
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>
                      <span className={item.type}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </td>
                    <td className={item.type}>${item.total.toFixed(2)}</td>
                    <td>{percentage}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Analytics;