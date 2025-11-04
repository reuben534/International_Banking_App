import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PaymentScreen from './screens/PaymentScreen';
import PaymentsPortalScreen from './screens/PaymentsPortalScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import EmployeePortal from './screens/EmployeePortal';

function App() {
  return (
    <>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/login' element={<LoginScreen />} />
            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/payment' element={<PaymentScreen />} />
            <Route path='/transactions' element={<TransactionHistoryScreen />} />
            <Route path='/admin/payments' element={<PaymentsPortalScreen />} />
            <Route path='/employee' element={<EmployeePortal />} />
            <Route path='/' element={<h1>Welcome to the International Payments Portal</h1>} exact />
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;
