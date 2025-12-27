package com.blog.repo;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.entity.User;

@Repository
public interface UserRepository  extends JpaRepository<User, Integer>{

	Optional<User> findByEmail(String email);
	
	Page<User> findByNameStartingWith(String searchText,Pageable pageable);
}
