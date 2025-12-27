package com.blog.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserSignInRequest
{
	@NotBlank
	private String email;
	
	@NotBlank
	private String password;
}
