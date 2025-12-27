package com.blog.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.blog.entity.BlogComment;
import com.blog.repo.CommentRepository;
import com.blog.service.ICommentService;

@Service
public class CommentServiceImpl implements ICommentService {

	@Autowired
	private CommentRepository commentRepository;
	
	@Override
	public BlogComment create(BlogComment blogComment) {
		return commentRepository.save(blogComment);
	}

	@Override
	public void delete(Integer commentId) {
		// TODO Auto-generated method stub
	    commentRepository.deleteById(commentId);
		
	}

	@Override
	public Page<BlogComment> getAllComment(Pageable pageable) {
		return commentRepository.findAll(pageable);
	}

	@Override
	public Page<BlogComment> getAllCommentByBlog(Integer blogId, Pageable pageable) {
		return commentRepository.findAllCommentsByBlogId(blogId, pageable);
	}

}
