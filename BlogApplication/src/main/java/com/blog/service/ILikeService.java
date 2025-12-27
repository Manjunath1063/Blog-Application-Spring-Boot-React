package com.blog.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.blog.entity.BlogLike;

public interface ILikeService 
{
  public BlogLike create(BlogLike like);
  public void delete(Integer id);
  public void deleteByUserIdAndBlogId(Integer userId , Integer blogId);
  public boolean isLiked(Integer userId , Integer blogId);
  public Page<BlogLike> getAllLikeOfBlog(Integer BlogId ,Pageable pageable);
}
