package com.blog.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserSignupRequest
{
	@NotBlank
	private String email;
	
	@NotBlank
	private String password;
	
	@NotBlank
	private String name;
}
