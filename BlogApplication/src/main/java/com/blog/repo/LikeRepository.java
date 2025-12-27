package com.blog.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.blog.entity.BlogLike;

import jakarta.transaction.Transactional;

public interface LikeRepository extends JpaRepository<BlogLike, Integer> {

	
	@Query("SELECT COUNT(l)>0 FROM BlogLike l WHERE l.user.id = :userId AND l.blog.id = :blogId")
	public boolean existsByUserIdAndBlogId(Integer userId,Integer blogId);
	
	@Query("SELECT l FROM BlogLike l WHERE l.blog.id = :blogId")
	public Page<BlogLike> getAllLikeByBlogId(Integer blogId , Pageable pageable);
	
	@Modifying
	@Transactional
	@Query("DELETE FROM BlogLike l WHERE l.user.id = :userId AND l.blog.id = :blogId")
	public void deleteLikeByUserIdAndBlogId(Integer userId,Integer blogId);
	
}
