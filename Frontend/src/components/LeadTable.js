import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LeadHistoryModal from './LeadHistoryModal';

const LeadTable = ({ agentId }) => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [remarks, setRemarks] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);

  const openHistoryModal = (leadId) => {
    setSelectedLeadId(leadId);
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setSelectedLeadId(null);
    setIsHistoryModalOpen(false);
  };
  useEffect(() => {
    axios.get(`http://localhost:8088/leads/assigned-to/${agentId}`)
      .then(response => {
        const filteredLeads = response.data.filter(lead => 
          lead.status !== 'Converted' && lead.status !== 'Declined'
        );

        setAssignedLeads(filteredLeads);

        const defaultStatus = filteredLeads.reduce((acc, lead) => {
          acc[lead.id] = 'New';
          return acc;
        }, {});
        setSelectedStatus(defaultStatus);
      })
      .catch(error => {
        console.error('Error fetching assigned leads:', error);
      });
  }, [agentId]);

  const handleStatusClick = (leadId, status) => {
    setSelectedStatus(prevStatus => ({
      ...prevStatus,
      [leadId]: status,
    }));
  };

  const handleDownload = () => {
    const csvData = convertDataToCSV(assignedLeads);

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'assigned_leads.csv';
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

  const handleRemarksChange = (leadId, event) => {
    const { value } = event.target;
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [leadId]: value,
    }));
  };

  const handleUpdateStatus = (leadId) => {
    const updatedStatus = selectedStatus[leadId];
    const updatedRemarks = remarks[leadId];
  
    const shouldUpdate = window.confirm('Are you sure you want to update the status?');
  
    if (shouldUpdate) {
      const requestBody = {
        status: updatedStatus,
        notes: updatedRemarks,
      };
  
      axios.put(`http://localhost:8088/leads/update-status/${leadId}`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          console.log('Lead status updated successfully:', response.data);
          window.location.reload();
        })
        .catch(error => {
          console.error('Error updating lead status:', error);
        });
    }
  };
  

  const handleClear = (leadId) => {
    setSelectedStatus(prevStatus => ({
      ...prevStatus,
      [leadId]: 'New',
    }));
    setRemarks(prevRemarks => ({
      ...prevRemarks,
      [leadId]: '',
    }));
  };

  const filteredLeads = assignedLeads.filter(lead => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const leadText = [
      lead.firstName,
      lead.lastName,
      lead.email,
      lead.mobile,
      lead.status,
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => leadText.includes(term));
  });

  return (
    <div className="flex flex-col p-3">
      <div className="sticky top-0 bg-white z-10">
        <br/>
        <div>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="block w-full px-10 py-2 text-purple-700 bg-white border rounded-full focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
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
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
         <table className="min-w-full divide-y divide-gray-200 px-8">
         <thead className="bg-blue-300 ">
                <tr className='sticky top-0'>
                <th scope="col" className="px-8 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider sticky">
                    
                  </th>
                  <th scope="col" className="px-1 py-3 text-left text-xs font-bold text-black uppercase tracking-wider sticky">
                    Lead Name
                  </th>
                  <th scope="col" className="px-7 py-3 text-left text-xs font-bold text-black uppercase tracking-wider sticky">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3 text-left text-xs ffont-bold text-black uppercase tracking-wider sticky">
                    Phone
                  </th>
                  <th scope="col" className="px-2 py-3 text-left text-xs font-bold text-black uppercase tracking-wider sticky">
                    Present Status
                  </th>
                  <th scope="col" className="px-7 py-3 text-left text-xs font-bold text-black uppercase tracking-wider sticky">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider sticky">
                    Remarks
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-black uppercase tracking-wider sticky">
                    Update Status
                  </th>
                </tr>
              </thead>
         </table>
         </div>
         </div>
         </div>
        </div>
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map(lead => (
           <tr key={lead.id}>
            <td className="px-6 py-4 whitespace-nowrap">
            <button
              onClick={() => openHistoryModal(lead.id)}
               className="px-4 rounded-full"
             >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
</svg>


                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.firstName + " " + lead.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleStatusClick(lead.id, 'Followup')}
                        className={`mr-2 ${selectedStatus[lead.id] === 'Followup' ? 'bg-blue-500' : 'bg-blue-200'} text-white px-3 py-1 rounded`}
                      >
                        Followup
                      </button>
                      <button
                        onClick={() => handleStatusClick(lead.id, 'Converted')}
                        className={`mr-2 ${selectedStatus[lead.id] === 'Converted' ? 'bg-green-500' : 'bg-green-200'} text-white px-3 py-1 rounded`}
                      >
                        Converted
                      </button>
                      <button
                        onClick={() => handleStatusClick(lead.id, 'Declined')}
                        className={`mr-2 ${selectedStatus[lead.id] === 'Declined' ? 'bg-red-500' : 'bg-red-200'} text-white px-3 py-1 rounded`}
                      >
                        Declined
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        className="border border-gray-400 rounded-lg"
                        placeholder="Click here to add remarks"
                        value={remarks[lead.id] || ''}
                        onChange={event => handleRemarksChange(lead.id, event)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
  <button
    onClick={() => handleUpdateStatus(lead.id)}
    className={`bg-gray-300 hover:bg-green-700 text-white px-2 py-1 rounded mr-2`}
  >
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
</svg>

  </button>
  <button
    onClick={() => handleClear(lead.id)}
    className={`text-black-500  hover:text-red-700 cursor-pointer`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

  </button>
</td>
                  </tr>
                ))}
                <LeadHistoryModal
    isOpen={isHistoryModalOpen}
    onClose={closeHistoryModal}
    leadId={selectedLeadId}
  />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadTable;