package com.example.LeadAgent.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.LeadAgent.Model.History;

public interface HistoryRepository extends MongoRepository<History, String> {
	// Find history entries by leadId
	List<History> findByLeadId(String leadId);
}
