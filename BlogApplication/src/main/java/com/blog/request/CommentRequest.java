package com.blog.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentRequest {
	@NotNull
	private Integer userId;

	@NotNull
	private Integer blogId;
	
	@NotBlank
	private String comment;
}
