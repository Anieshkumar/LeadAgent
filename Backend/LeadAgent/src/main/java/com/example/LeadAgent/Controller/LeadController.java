package com.example.LeadAgent.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.LeadAgent.Model.Lead;
import com.example.LeadAgent.Service.LeadService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("leads")
public class LeadController {
	@Autowired
	private LeadService leadService;

	// Endpoint to save a new lead
	@PostMapping(value = "/save")
	private String saveLead(@RequestBody Lead leads) {

		leadService.saveLead(leads);
		return leads.getId();
	}

	// Endpoint to get all leads
	@GetMapping(value = "/getAll")
	public List<Lead> getUsers() {
		return leadService.getAllLeads();
	}

	// Endpoint to get a lead by its ID
	@GetMapping(value = "/get/{id}")
	private Lead getLead(@PathVariable(name = "id") String id) {
		return leadService.getLeadById(id);
	}

	// Endpoint to delete a lead by its ID
	@DeleteMapping("/delete/{id}")
	private void deleteUser(@PathVariable("id") String id) {
		leadService.deleteLeadById(id);
	}

	// Endpoint to get leads by assigned user
	@GetMapping("/assigned-to/{assignedTo}")
	public List<Lead> getLeadsByAssignedTo(@PathVariable String assignedTo) {
		return leadService.getLeadsByAssignedTo(assignedTo);
	}

	// Endpoint to update lead status
	@PutMapping("/update-status/{leadId}")
	public ResponseEntity<Lead> updateLeadStatus(@PathVariable String leadId,
			@RequestBody Map<String, String> requestPayload) {
		String status = requestPayload.get("status");
		String notes = requestPayload.get("notes");

		Lead updatedLead = leadService.updateLeadStatus(leadId, status, notes);
		if (updatedLead != null) {
			return ResponseEntity.ok(updatedLead);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

}
