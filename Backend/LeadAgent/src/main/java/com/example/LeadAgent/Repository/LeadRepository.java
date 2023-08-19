package com.example.LeadAgent.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.LeadAgent.Model.Lead;

public interface LeadRepository extends MongoRepository<Lead, String> {
	// Method to retrieve leads based on the assigned user
	List<Lead> findByAssignedTo(String assignedTo);

}