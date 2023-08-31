
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadHistoryModal = ({ isOpen, onClose, leadId }) => {
  const [leadHistory, setLeadHistory] = useState([]);

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLeadHistory(leadId);
    }
  }, [isOpen, leadId]);

  const fetchLeadHistory = async (leadId) => {
    try {
      const response = await axios.get(`http://localhost:8088/history/${leadId}`);
      setLeadHistory(response.data.reverse());
    } catch (error) {
      console.error('Error fetching lead history:', error);
    }
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-gray-800 opacity-75"></div>

      <div className="bg-white p-6 rounded-lg z-10 max-h-[80vh] overflow-hidden">
        <button onClick={onClose} className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-red-600 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4 sticky top-0 bg-white z-10">Selected Lead History</h2>

        <div className="shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
          <div className="max-h-[60vh] overflow-y-scroll">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
              <tr className='table-header bg-blue-300 sticky top-0 z-10'>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Lead Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Old Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  New Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Modified By
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Notes
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">
                  Modified / Created Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leadHistory.map(entry => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.leadName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.oldStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.newStatus}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.modifiedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.notes}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(entry.modificationDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default LeadHistoryModal;

