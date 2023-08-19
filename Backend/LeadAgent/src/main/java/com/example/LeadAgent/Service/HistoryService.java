package com.example.LeadAgent.Service;

import com.example.LeadAgent.Model.History;
import com.example.LeadAgent.Repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryService {

	private final HistoryRepository historyRepository;

	@Autowired
	public HistoryService(HistoryRepository historyRepository) {
		this.historyRepository = historyRepository;
	}

	// Save a history entry
	public History saveHistory(History history) {
		return historyRepository.save(history);
	}

	// Get history entries by lead ID
	public List<History> getHistoryByLeadId(String leadId) {
		return historyRepository.findByLeadId(leadId);
	}

	// Get all history entries
	public List<History> getHistory() {
		return historyRepository.findAll();
	}
}
