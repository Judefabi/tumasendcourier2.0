import React from 'react';
import { AuthProvider } from '../firebase/AuthProvider';
import Routes from './Route';

const Providers = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default Providers;