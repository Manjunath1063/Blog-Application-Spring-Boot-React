package com.blog.response;


import lombok.Data;

@Data
public class UserProfileResponse
{
	private Long id;
	private String email;
	private String password;
	private Integer blogsCount;
	private String name;
	private String img;
}
