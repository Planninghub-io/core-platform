
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-50 to-fuchsia-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
