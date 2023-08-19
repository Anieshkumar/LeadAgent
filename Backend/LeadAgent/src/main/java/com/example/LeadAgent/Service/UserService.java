package com.example.LeadAgent.Service;

import com.example.LeadAgent.Model.User;
import com.example.LeadAgent.Repository.UserRepository;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UserService {

	@Autowired
	private UserRepository repo;

	// For hashing the password
	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public void saveorUpdate(User users) {
		// Hash the password before saving
		String hashedPassword = passwordEncoder.encode(users.getPassword());
		users.setPassword(hashedPassword);
		repo.save(users);
	}

	// Get a list of all users
	public Iterable<User> listAll() {
		return this.repo.findAll();
	}

	// Delete a user by their ObjectId
	public void deleteUser(ObjectId objectId) {
		repo.deleteById(objectId);
	}

	// Get a user by their ID
	public User getUserByID(String userId) {
		return repo.findById(userId).orElse(null);
	}

	// Checks if the user present with the given credentials
	public User authenticateUser(String email, String password) {
		if (password.length() < 8) {
			return null;
		}
		User user = repo.findByEmail(email);
		if (user != null && passwordEncoder.matches(password, user.getPassword())) {
			return user;
		} else {
			return null;
		}
	}

	// Validates whether the email is in right format
	public boolean isValidEmail(String email) {
		return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
	}

}
