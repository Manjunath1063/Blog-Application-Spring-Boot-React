package com.blog.dto;

import java.time.LocalDateTime;

import com.blog.entity.User;

import lombok.Data;

@Data
public class BlogDTO {

	private Long id;

    private String title;

    private String content;

    private User author;
    
    private Long likes;
    
    private String img;
    
    private String hashTags;
    
    private LocalDateTime createdAt;
    
    private boolean isLiked;
    
    private Long comments;
}
