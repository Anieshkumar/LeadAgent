package com.example.LeadAgent.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.LeadAgent.Model.History;
import com.example.LeadAgent.Service.HistoryService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("history")
public class HistoryController {
	@Autowired
	private HistoryService historyService;

	// Retrieve history entries for a specific lead by leadId
	@GetMapping("/{leadId}")
	public List<History> getLeadHistory(@PathVariable String leadId) {
		return historyService.getHistoryByLeadId(leadId);
	}

	// Retrieve all history entries
	@GetMapping("/getAll")
	public List<History> getLeadHistory() {
		return historyService.getHistory();
	}
}
