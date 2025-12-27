package com.blog.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.blog.entity.BlogComment;

public interface ICommentService
{
   public BlogComment create(BlogComment blogComment);
   public void delete(Integer commentId);
   public Page<BlogComment> getAllComment(Pageable pageable);
   public Page<BlogComment> getAllCommentByBlog(Integer blogId , Pageable pageable);
   
}
