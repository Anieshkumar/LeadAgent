package com.example.LeadAgent.Repository;

import com.example.LeadAgent.Model.User;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
    // Find a user by their email
	User findByEmail(String email);
	
	// Delete a user by their ObjectId
	void deleteById(ObjectId objectId);
}
