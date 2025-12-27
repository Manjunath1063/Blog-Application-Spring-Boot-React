package com.blog.repo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.blog.entity.Blog;


@Repository
public interface BlogRepository extends JpaRepository<Blog, Integer> {

	@Query(value = "SELECT * FROM blog b WHERE hash_tags REGEXP :hasTags", nativeQuery = true)
	Page<Blog> findByHashTagsContaining(@Param("hasTags") String hashTags , Pageable pageable);
	
	@Query("SELECT b FROM Blog b WHERE b.author.id = :userId")
	Page<Blog> findByUser(Integer userId ,Pageable pageable);
	
}
