package com.example.LeadAgent.Model;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "history")
public class History {

	@Id
	private String id;
	private String leadId;
	private String leadName;
	private String oldStatus;
	private String newStatus;
	private String modifiedBy;
	private String notes;
	private Date modificationDate;

	// Constructor to initialize/create History object
	public History(String leadId, String leadName, String oldStatus, String newStatus, String modifiedBy, String notes,
			Date modificationDate) {
		this.leadId = leadId;
		this.leadName = leadName;
		this.oldStatus = oldStatus;
		this.newStatus = newStatus;
		this.modifiedBy = modifiedBy;
		this.notes = notes;
		this.modificationDate = modificationDate;
	}

	// Getter and setter methods
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLeadId() {
		return leadId;
	}

	public void setLeadId(String leadId) {
		this.leadId = leadId;
	}

	public String getLeadName() {
		return leadName;
	}

	public void setLeadName(String leadName) {
		this.leadName = leadName;
	}

	public String getOldStatus() {
		return oldStatus;
	}

	public void setOldStatus(String oldStatus) {
		this.oldStatus = oldStatus;
	}

	public String getNewStatus() {
		return newStatus;
	}

	public void setNewStatus(String newStatus) {
		this.newStatus = newStatus;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public Date getModificationDate() {
		return modificationDate;
	}

	public void setModificationDate(Date modificationDate) {
		this.modificationDate = modificationDate;
	}

}