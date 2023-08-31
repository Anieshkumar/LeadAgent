
package com.example.LeadAgent.Controller;

import com.example.LeadAgent.Model.User;
import com.example.LeadAgent.Model.LoginResponse;
import com.example.LeadAgent.Service.UserService;

import java.util.Map;
import org.bson.types.ObjectId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("users")
public class UserController {

	@Autowired
	private UserService userService;

	// Endpoint to save a user
	@PostMapping(value = "/save")
	private String saveUser(@RequestBody User users) {
		userService.saveorUpdate(users);
		return users.getId();
	}

	// Endpoint for resetting user password
	@PostMapping("/reset-password")
	private ResponseEntity<String> resetPassword(@RequestBody Map<String, String> resetRequest) {
		String email = resetRequest.get("email");
		String newPassword = resetRequest.get("newPassword");

		if (userService.isValidEmail(email)) {
			User user = userService.getUserByEmail(email);
			if (user != null) {
				user.setPassword(newPassword);
				userService.saveorUpdate(user);
				return ResponseEntity.ok("Password reset successful");
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
			}
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email format");
		}
	}

	// Endpoint to get all users
	@GetMapping(value = "/getAll")
	public Iterable<User> getUsers() {
		return userService.listAll();
	}

	// Endpoint to update a user
	@PutMapping(value = "/edit/{id}")
	private User update(@RequestBody User users, @PathVariable(name = "id") String id) {
		users.setId(id);
		userService.saveorUpdate(users);
		return users;
	}

	// Endpoint to delete a user by ID
	@DeleteMapping("/delete/{id}")
	private void deleteUser(@PathVariable("id") String id) {
		try {
			// Convert the string id to ObjectId
			ObjectId objectId = new ObjectId(id);
			userService.deleteUser(objectId);
		} catch (IllegalArgumentException e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid id format");
		}
	}

	// Endpoint to get a user by ID
	@GetMapping("/getUserById/{id}")
	private ResponseEntity<User> getUserById(@PathVariable(name = "id") String userId) {
		User user = userService.getUserByID(userId);
		if (user != null) {
			return ResponseEntity.ok(user);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// Endpoint for user authentication
	@PostMapping("/login")
	private ResponseEntity<LoginResponse> authenticate(@RequestBody Map<String, String> credentials) {
		String email = credentials.get("email");
		String password = credentials.get("password");

		LoginResponse response = new LoginResponse();

		// Check if the email is valid
		if (!userService.isValidEmail(email)) {
			response.setStatus(false);
			response.setMessage("Invalid email");
			return ResponseEntity.ok(response);
		}

		// Authenticate the user
		User user = userService.authenticateUser(email, password);

		if (user != null && user.getRole().equalsIgnoreCase("Agent")) {
			response.setStatus(true);
			response.setMessage("Valid login");
			response.setName(user.getFirstName() + " " + user.getLastName()); // To display name in the dashboard
			response.setId(user.getId()); // To get the leads assigned to this Id
		} else if (user != null && !user.getRole().equalsIgnoreCase("Agent")) {
			response.setStatus(false);
			response.setMessage("Oops! Something went wrong");
		} else if (user == null && password.isEmpty()) {
			response.setStatus(false);
			response.setMessage("Password should not be empty");
		} else if (user == null && password.length() < 8) {
			response.setStatus(false);
			response.setMessage("Password should be at least 8 characters long");
		} else {
			response.setStatus(false);
			response.setMessage("Invalid email or password");
		}

		return ResponseEntity.ok(response);
	}

}

