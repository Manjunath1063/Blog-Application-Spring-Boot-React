package com.blog.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.blog.entity.User;

public interface IUserService 
{
  public User create(User user);
  public User update(User user);
  public User findById(Integer id);
  public User findByEmail(String email);
  public Page<User> findAll(String searchText ,Pageable pageable);
  public void deleteById(Integer id);
}
