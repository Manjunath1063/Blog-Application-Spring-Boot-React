package com.blog.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.blog.entity.User;
import com.blog.repo.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService 
{
	
	@Autowired
	private UserRepository userRepository;
	

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	   
		User user = userRepository.findByEmail(username).orElse(null);
		
		if(user ==null)
		{
			throw new UsernameNotFoundException("User Not Found");
		}
		
		return new CustomUserDetails(user);
		
	}

}
