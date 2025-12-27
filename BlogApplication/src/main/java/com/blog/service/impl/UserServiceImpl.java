package com.blog.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.blog.entity.User;
import com.blog.repo.UserRepository;
import com.blog.service.IUserService;

@Service
public class UserServiceImpl implements IUserService {

	@Autowired
	private UserRepository userRepository;
	
	@Override
	public User create(User user) {
		return userRepository.save(user);
	}

	@Override
	public User update(User user) {
		return userRepository.save(user);
	}

	@Override
	public User findById(Integer id) {
		return userRepository.findById(id).orElse(null);
	}

	@Override
	public User findByEmail(String email) {
		return userRepository.findByEmail(email).orElse(null);
	}

	@Override
	public Page<User> findAll(String searchText, Pageable pageable) {
		return  (searchText==null || searchText== "") ? userRepository.findAll(pageable) : userRepository.findByNameStartingWith(searchText, pageable) ;
	}

	@Override
	public void deleteById(Integer id) {
		
		userRepository.deleteById(id);

	}

}
