package com.blog.dto;

import java.util.List;

import com.blog.entity.Blog;

import lombok.Data;


@Data
public class UserDTO {

	private Long id;
	private String email;
	private String password;
	private List<Blog> blogs;
	private String name;
    private String profileImgUrl;
	private String profileImgUrlPublicId;
}
