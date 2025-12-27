package com.blog.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.blog.entity.BlogLike;
import com.blog.repo.LikeRepository;
import com.blog.service.ILikeService;

@Service
public class LikeServiceImpl  implements  ILikeService{

	
	@Autowired
	private LikeRepository likeRepository;
	
	@Override
	public BlogLike create(BlogLike like) {
		return likeRepository.save(like);
	}

	@Override
	public void delete(Integer id) {
		 likeRepository.deleteById(id);
	}

	@Override
	public boolean isLiked(Integer userId, Integer blogId) {
		return likeRepository.existsByUserIdAndBlogId(userId, blogId);
	}
	
	@Override
	public void deleteByUserIdAndBlogId(Integer userId, Integer blogId) {
		likeRepository.deleteLikeByUserIdAndBlogId(userId, blogId);
		
	}

	@Override
	public Page<BlogLike> getAllLikeOfBlog(Integer BlogId, Pageable pageable) {
		return likeRepository.getAllLikeByBlogId(BlogId, pageable);
	}

}
