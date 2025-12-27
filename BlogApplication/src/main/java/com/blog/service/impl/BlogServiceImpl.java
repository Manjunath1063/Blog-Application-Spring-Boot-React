package com.blog.service.impl;

import java.util.Arrays;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.blog.entity.Blog;
import com.blog.repo.BlogRepository;
import com.blog.service.IBlogService;

@Service
public class BlogServiceImpl implements IBlogService {

	@Autowired
	private BlogRepository blogRepository;

	@Override
	public Blog create(Blog blog) {

		return blogRepository.save(blog);
	}

	@Override
	public Page<Blog> findAll(String searchtags, Pageable pageable) {

		System.out.println(searchtags);
		
		return (searchtags == null || searchtags == "") ? blogRepository.findAll(pageable)
				: blogRepository.findByHashTagsContaining(Arrays.stream(searchtags.split(","))
						.map(tag->tag)
	                     .map(Pattern::quote)
	                     .collect(Collectors.joining("|")), pageable);
	}

	@Override
	public Blog update(Blog blog) {
		// TODO Auto-generated method stub
		return blogRepository.save(blog);
	}

	@Override
	public Page<Blog> findByUserId(Integer userId,Pageable pageable) {
		return blogRepository.findByUser(userId ,pageable);
	}

	@Override
	public Blog findById(Integer BlogId) {
		return blogRepository.findById(BlogId).orElse(null);
	}
	
	@Override
	public void deleteById(Integer id) {
		blogRepository.deleteById(id);
	}

}
