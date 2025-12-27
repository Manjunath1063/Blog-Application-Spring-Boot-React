package com.blog.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.blog.entity.Blog;

public interface IBlogService {
	
	public Blog create(Blog blog);

	public Page<Blog> findAll(String searchtags , Pageable pageable);

	public Blog update(Blog blog);

	public Page<Blog> findByUserId(Integer userId,Pageable pageable);

	public Blog findById(Integer BlogId);
	
	public void deleteById(Integer id);
}
