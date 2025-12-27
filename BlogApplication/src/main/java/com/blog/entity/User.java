package com.blog.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String email;

	@Column(nullable = false)
	private String password;
	
	private String name;

	private String role = "USER"; // Default role
	
	
	private String profileImgUrl;
	
	private String profileImgUrlPublicId;

	@JsonIgnore
	@OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
	private List<Blog> blogs;
}
