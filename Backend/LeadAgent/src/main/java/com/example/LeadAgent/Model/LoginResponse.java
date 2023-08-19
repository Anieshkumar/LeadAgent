package com.example.LeadAgent.Model;

public class LoginResponse {
	private boolean status; // Status of the login attempt (true for success, false for failure)
	private String message; // Message describing the result of the login attempt
	private String name; // Name of the user who logged in (if successful)
	private String id; // ID of the user who logged in (if successful)

	// Getter and setter methods
	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

}