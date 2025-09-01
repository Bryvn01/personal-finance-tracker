const translations = {
  en: {
    'Dashboard': 'Dashboard',
    'Transactions': 'Transactions',
    'Budgets': 'Budgets',
    'Analytics': 'Analytics',
    'Logout': 'Logout',
    'Amount': 'Amount',
    'Description': 'Description',
    'Category': 'Category',
    'Date': 'Date',
    'Type': 'Type',
    'Income': 'Income',
    'Expense': 'Expense',
    'Save': 'Save',
    'Cancel': 'Cancel',
    'Edit': 'Edit',
    'Delete': 'Delete',
    'Add': 'Add',
    'Add Transaction': 'Add Transaction',
    'Recent Transactions': 'Recent Transactions',
    'Set Budget': 'Set Budget',
    'Budget Management': 'Budget Management',
    'Budget Amount': 'Budget Amount',
    'Select Category': 'Select Category',
    'Email': 'Email',
    'Password': 'Password',
    'Login': 'Login',
    'Register': 'Register',
    'Username': 'Username',
    'Confirm Password': 'Confirm Password',
    'Create Account': 'Create Account',
    'Total Income': 'Total Income',
    'Total Expenses': 'Total Expenses',
    'Net Income': 'Net Income',
    'Analytics & Insights': 'Analytics & Insights',
    'View Analytics for:': 'View Analytics for:',
    'View Budget for:': 'View Budget for:',
    'Features': 'Features',
    'Reviews': 'Reviews',
    'Get Started': 'Get Started'
  }
};

let currentLanguage = process.env.REACT_APP_DEFAULT_LANGUAGE || 'en';

export const t = (key) => {
  return translations[currentLanguage][key] || key;
};

export const setLanguage = (lang) => {
  currentLanguage = lang;
};