package com.blog.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.blog.entity.BlogComment;

public interface CommentRepository extends JpaRepository<BlogComment, Integer> {

	@Query("SELECT c FROM BlogComment c WHERE blog.id= :blogId")
	Page<BlogComment> findAllCommentsByBlogId(Integer blogId,Pageable pageable);
}
