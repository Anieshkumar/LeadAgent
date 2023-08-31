import React, { useState } from 'react';

const ForgotPage = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    setErrorMessage('');
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setErrorMessage('');
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    fetch('http://localhost:8088/users/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword }),
    })
      .then((response) => response.text())
      .then((data) => {
        setSuccessMessage(data);
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch(() => {
        setErrorMessage('Error occurred while resetting password. Please try again.');
      });
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-900 h-screen flex justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg hover:shadow-xl p-6 dark:bg-gray-800">
      <img
          className="h-8 mr-2 mb-4"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/MassMutual_logo.svg/2560px-MassMutual_logo.svg.png"
          alt="MassMutual Logo"
        />
        <br></br>
        <div className="mb-4">
          <h2 className=" text-2xl font-semibold text-gray-800 dark:text-white">
            Reset Your Password
          </h2>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:bg-white focus:text-black focus:placeholder-transparent"
            placeholder="Enter your email"
          />
        </div>
        <div className='mt-4'>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:bg-white focus:text-black focus:placeholder-transparent"
            placeholder="••••••••"
          />
        </div>
        <div className='mt-4'>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:bg-white focus:text-black focus:placeholder-transparent"
            placeholder="••••••••"
          />
        </div>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        <button
          onClick={handleResetPassword}
          className="mt-4 w-full text-white bg-blue-600 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Reset Password
        </button>
      </div>
    </section>
  );
};

export default ForgotPage;