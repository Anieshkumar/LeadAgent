
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadHistory = () => {
  const [leadHistory, setLeadHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8088/history/getAll') 
      .then(response => {
        setLeadHistory(response.data.reverse());
      })
      .catch(error => {
        console.error('Error fetching lead history:', error);
      });
  }, []);

  const handleDownload = () => {
    const csvData = convertDataToCSV(leadHistory);

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'history.csv';
    link.click();

    window.URL.revokeObjectURL(url);
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

  const filteredHistory = leadHistory.filter(history => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const historyText = [
      history.leadName,
      history.oldStatus,
      history.newStatus,
      history.modifiedBy,
      history.notes,
      new Date(history.modificationDate).toLocaleString(),
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => historyText.includes(term));
  });

  return (
    <div className="p-3">
      <div className="flex flex-col">
        <div className="sticky top-0 bg-white z-10">
          <div>
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full px-10 py-2 text-blue-700 bg-white border rounded-full focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Search..."
            />
            <button
            onClick={handleDownload}
            className="p-2 text-white bg-blue-600 hover:text-white rounded-lg hover:bg-green-500 cursor-pointer dark:text-gray-900 dark:hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
  <path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clip-rule="evenodd" />
</svg>

          </button>
            </div>
            <div className="-my-2  sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle   inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="bg-blue-300  sticky top-0 z-10">
                  <tr className='table-header'>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider sticky">
                      Lead Name
                    </th>
                    <th scope="col" className="px-5 py-4 text-xs font-bold text-black uppercase tracking-wider sticky">
                      Old Status
                    </th>
                    <th scope="col" className="px-8 py-4 text-center text-xs font-bold text-black uppercase tracking-wider sticky">
                      New Status
                    </th>
                    <th scope="col" className="px-5 py-4 text-xs font-bold text-black uppercase tracking-wider sticky">
                      Modified By
                    </th>
                    <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-black uppercase tracking-wider sticky">
                      Notes
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider sticky">
                      Modified / Created Date
                    </th>
                  </tr>
                </thead>
                </table>
              </div>
              </div>
              </div>
          </div>
        </div>
        <div className="-my-2 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle  text-left inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 ">
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map(history => (
                    <tr key={history.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {history.leadName}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {history.oldStatus}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap">
                        {history.newStatus}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {history.modifiedBy}
                      </td>
                      <td className="px-6 py-4 text-left whitespace-nowrap">
                        {history.notes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(history.modificationDate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadHistory;

