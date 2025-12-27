package com.blog.dto;

import java.time.LocalDateTime;

import lombok.Data;


@Data
public class BlogCommentDTO
{
   private Integer id;
   
   private Integer userId;
   
   private String userName;
   
   private Integer blogId;
   
   private String comment;
   
   private LocalDateTime createdAt;
}
