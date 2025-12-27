package com.blog.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBlogRequest {

	@NotBlank
	private String title;

	@NotBlank
    private String content;

	@NotBlank
    private String hashTags;
    
	@NotBlank
    private String img;
}
