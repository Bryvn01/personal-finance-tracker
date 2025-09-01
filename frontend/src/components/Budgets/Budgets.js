import React, { useState, useEffect } from 'react';
import { budgetsAPI, categoriesAPI } from '../../services/api';
import { t } from '../../utils/i18n';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Budgets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Authorization check
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    category_id: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, [currentMonth, currentYear]);

  const fetchBudgets = async () => {
    try {
      const response = await budgetsAPI.getAll(currentMonth, currentYear);
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.filter(cat => cat.type === 'expense'));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await budgetsAPI.create(formData);
      fetchBudgets();
      setFormData({
        category_id: '',
        amount: '',
        month: currentMonth,
        year: currentYear
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#dc3545';
    if (percentage >= 80) return '#ffc107';
    return '#28a745';
  };

  const getProgressWidth = (percentage) => {
    return Math.min(percentage, 100);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1>{t('Budget Management')}</h1>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          {t('Set Budget')}
        </button>
      </div>

      {/* Month/Year Selector */}
      <div className="card mb-3">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label>View Budget for:</label>
          <select 
            value={currentMonth} 
            onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
          >
            {Array.from({length: 12}, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select 
            value={currentYear} 
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
          >
            {Array.from({length: 5}, (_, i) => (
              <option key={currentYear - 2 + i} value={currentYear - 2 + i}>
                {currentYear - 2 + i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="card mb-3">
          <h3>{t('Set Budget')}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>{t('Category')}</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  required
                >
                  <option value="">{t('Select Category')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t('Budget Amount')}</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-success">
                {t('Set Budget')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                {t('Cancel')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>
          Budget Overview - {new Date(0, currentMonth - 1).toLocaleString('default', { month: 'long' })} {currentYear}
        </h3>
        
        {budgets.length === 0 ? (
          <p>No budgets set for this month. Set your first budget to start tracking!</p>
        ) : (
          <div>
            {budgets.map(budget => {
              const percentage = (budget.spent_amount / budget.amount) * 100;
              return (
                <div key={budget.id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4>{budget.category_name}</h4>
                    <span style={{ color: getProgressColor(percentage), fontWeight: 'bold' }}>
                      ${budget.spent_amount || 0} / ${budget.amount}
                    </span>
                  </div>
                  
                  <div style={{ 
                    width: '100%', 
                    height: '20px', 
                    backgroundColor: '#f0f0f0', 
                    borderRadius: '10px',
                    overflow: 'hidden',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{
                      width: `${getProgressWidth(percentage)}%`,
                      height: '100%',
                      backgroundColor: getProgressColor(percentage),
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                    <span>{percentage.toFixed(1)}% used</span>
                    <span>${(budget.amount - (budget.spent_amount || 0)).toFixed(2)} remaining</span>
                  </div>
                  
                  {percentage >= 80 && (
                    <div style={{ 
                      marginTop: '0.5rem', 
                      padding: '0.5rem', 
                      backgroundColor: percentage >= 100 ? '#fee' : '#fff3cd',
                      border: `1px solid ${percentage >= 100 ? '#fcc' : '#ffeaa7'}`,
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      {percentage >= 100 ? '⚠️ Budget exceeded!' : '⚠️ Approaching budget limit'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budgets;