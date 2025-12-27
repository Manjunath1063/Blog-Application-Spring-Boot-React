package com.blog.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class BlogLike {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "userId")
	private User user;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "blogId")
	private Blog blog;
	
	private LocalDateTime createdAt;
}
