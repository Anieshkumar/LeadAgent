
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AssignedLeadsTable from './LeadTable';
import LeadHistoryTable from './LeadHistory';

const MainPage = () => {
  const location = useLocation();
  const agentInfo = location?.state?.agentInfo || {};
  const [activeTab, setActiveTab] = useState(0);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignedLeads().then((data) => setAssignedLeads(data));
    fetchHistoryData().then((data) => setHistoryData(data));
  }, []);

  const handleTabSelect = (index) => {
    setActiveTab(index);
  };

  const handleDownload = (tabIndex) => {
    const dataToDownload = tabIndex === 0 ? assignedLeads : historyData;
    const csvData = convertDataToCSV(dataToDownload);

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = tabIndex === 0 ? 'assigned_leads.csv' : 'history.csv';
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const fetchAssignedLeads = async () => {
    const response = await fetch(`http://localhost:8088/leads/assigned-to/${agentInfo.id}`);
    const data = await response.json();
    return data;
  };

  const fetchHistoryData = async () => {
    const response = await fetch('http://localhost:8088/history/getAll');
    const data = await response.json();
    return data;
  };

  const convertDataToCSV = (data) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    data.forEach((rowData) => {
      const values = headers.map((header) => rowData[header]);
      csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <header className="bg-blue-500 rounded p-4 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome to your Dashboard <span className="text-white">{agentInfo.name}</span>
        </h1>
        <div className="flex absolute top-4 right-4 space-x-4">
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded text-white hover:bg-green-600 font-semibold bg-blue-700 flex items-center cursor-pointer"
          >
            Logout &nbsp;
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
          </button>
        </div>
      </header>

      <br />

      <div className="sticky top-0 bg-white">
        <Tabs>
          <TabList className="flex">
            <Tab
              className={`py-2 px-5 text-xl text-gray-600 hover:text-blue-600 font-semibold cursor-pointer transition ${
                activeTab === 0 ? 'border-b-4 border-green-600' : ''
              }`}
              selectedClassName="text-gray-900 font-semibold"
              onClick={() => handleTabSelect(0)}
            >
              Assigned Leads
            </Tab>
            <div className="h-6 w-px bg-gray-300 my-auto mx-4"></div>
            <Tab
              className={`py-2 px-4 text-xl text-gray-600 hover:text-blue-600 font-semibold cursor-pointer transition ${
                activeTab === 1 ? 'border-b-4 border-green-600' : ''
              }`}
              selectedClassName="text-gray-900 font-semibold"
              onClick={() => handleTabSelect(1)}
            >
              History
            </Tab>
          </TabList>
        </Tabs>
      </div>

      <div className="flex-grow max-h-[calc(100vh-200px)] overflow-y-auto">
        <Tabs selectedIndex={activeTab} onSelect={handleTabSelect}>
          <TabPanel>
            <AssignedLeadsTable agentId={agentInfo.id} />
          </TabPanel>
          <TabPanel>
            <LeadHistoryTable />
          </TabPanel>
        </Tabs>
      </div>

      <br />

      <footer className="bg-white rounded-lg shadow sm:flex sm:items-center sm:justify-between p-4 dark:bg-gray-800">
        <img className="h-8 mr-2" src="https://tedxhyderabad.com/wp-content/uploads/2022/09/MassMutual-India_logo.png" alt="logo" />
        <p className="mb-4 text-sm text-center text-gray-500 dark:text-gray-400 sm:mb-0">
          &copy; 2023 <a href="https://www.massmutual.com/" className="hover:underline" target="_blank" rel="noreferrer">
            MassMutual India
          </a>. All rights reserved.
        </p>

        <div className="flex justify-center items-center space-x-1">
        <a href="https://www.facebook.com/massmutual/" target="_blank" rel='noreferrer' className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
    <svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-5 w-5"
  fill="currentColor"
  viewBox="0 0 24 24">
  <path
    d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
</svg>
      <span className="sr-only">Facebook</span>
    </a>
    <a href="https://www.linkedin.com/company/massmutual-india/" target="_blank" rel='noreferrer' className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
    <svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-5 w-5"
  fill="currentColor"
  viewBox="0 0 24 24">
  <path
    d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
</svg>
      <span className="sr-only">Linkedin</span>
    </a>
    <a href="https://github.com/massmutual" target="_blank" rel='noreferrer' className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
    <svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-5 w-5"
  fill="currentColor"
  viewBox="0 0 24 24">
  <path
    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
</svg>
      <span className="sr-only">Github</span>
    </a>
    <a href="https://twitter.com/massmutual" target="_blank" rel='noreferrer' className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer dark:text-gray-400 dark:hover:text-white hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-600">
    <svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-5 w-5"
  fill="currentColor"
  viewBox="0 0 24 24">
  <path
    d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
</svg>
      <span className="sr-only">Twitter</span>
    </a>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
