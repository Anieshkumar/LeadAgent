package com.example.LeadAgent.Service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.LeadAgent.Model.History;
import com.example.LeadAgent.Model.Lead;
import com.example.LeadAgent.Repository.HistoryRepository;
import com.example.LeadAgent.Repository.LeadRepository;

@Service
public class LeadService {

	@Autowired
	private HistoryRepository historyRepository;

	private final LeadRepository leadRepository;

	@Autowired
	public LeadService(LeadRepository leadRepository) {
		this.leadRepository = leadRepository;
	}

	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	// Save a lead and create a history entry
	public Lead saveLead(Lead lead) {
		String hashedPassword = passwordEncoder.encode(lead.getPassword());
		lead.setPassword(hashedPassword);
		Lead id = leadRepository.save(lead);
		String leadId = id.getId();
		History newHistory = new History(leadId, lead.getName(), "New", "New", "New", "New", lead.getCreatedAt());
		historyRepository.save(newHistory);
		return id;
	}

	// Retrieve all leads
	public List<Lead> getAllLeads() {
		return leadRepository.findAll();
	}

	// Get a lead by its ID
	public Lead getLeadById(String id) {
		return leadRepository.findById(id).orElse(null);
	}

	// Delete a lead by its ID
	public void deleteLeadById(String id) {
		leadRepository.deleteById(id);
	}

	// Get leads assigned to a specific user
	public List<Lead> getLeadsByAssignedTo(String assignedTo) {
		return leadRepository.findByAssignedTo(assignedTo);
	}

	// Update lead status and create a history entry
	public Lead updateLeadStatus(String leadId, String status, String notes) {
		Lead lead = leadRepository.findById(leadId).orElse(null);
		if (lead != null) {
			String oldStatus = lead.getStatus();
			// Update lead status and notes
			lead.setStatus(status);
			lead.setNotes(notes);
			lead.setUpdatedAt(new Date());
			leadRepository.save(lead);
			// Create a new history entry for the lead status update
			History history = new History(leadId, lead.getName(), oldStatus, status, lead.getAssignedTo(), notes,
					new Date());
			historyRepository.save(history);
		}
		return lead;
	}

}
