import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeadsTable = ({ agentId }) => {
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [remarks, setRemarks] = useState({});

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
};
  

  return (
    <div className="flex flex-col">
      <br/>
      <h1 className="text-3xl font-bold mb-4">Assigned Leads</h1>
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
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Present Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Update Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedLeads.map(lead => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.name}</td>
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
                        placeholder="Add remarks"
                        value={remarks[lead.id] || ''}
                        onChange={event => handleRemarksChange(lead.id, event)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleUpdateStatus(lead.id)}
                        className={`bg-green-600 text-white px-3 py-1 rounded`}
                      >
                        Update Status
                      </button>
                    </td>
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

export default LeadsTable;