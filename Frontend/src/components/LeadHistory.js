import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadHistory = () => {
  const [leadHistory, setLeadHistory] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8088/history/getAll') 
      .then(response => {
        setLeadHistory(response.data.reverse());
      })
      .catch(error => {
        console.error('Error fetching lead history:', error);
      });
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-4">History</h1>
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <br></br>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lead Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Old Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      New Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modified By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Modification Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leadHistory.map(history => (
                    <tr key={history.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {history.leadName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {history.oldStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {history.newStatus}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {history.modifiedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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