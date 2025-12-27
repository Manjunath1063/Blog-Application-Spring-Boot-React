package com.blog.rest;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blog.dto.BlogLikeDTO;
import com.blog.entity.Blog;
import com.blog.entity.BlogLike;
import com.blog.entity.User;
import com.blog.exception.BlogException;
import com.blog.request.LikeRequest;
import com.blog.response.ApiResponse;
import com.blog.service.CustomUserDetails;
import com.blog.service.IBlogService;
import com.blog.service.ILikeService;
import com.blog.service.IUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/like")
public class LikeController {
	
	@Autowired
	private IBlogService blogService;
	
	@Autowired
	private ILikeService likeService;
	
	@Autowired
	private IUserService userService;
	
	
	@PostMapping("/secure/create")
	public ResponseEntity<ApiResponse<?>> likeBlog(
			@AuthenticationPrincipal CustomUserDetails userDetails ,
			@Valid @RequestBody LikeRequest request , 
			BindingResult bindingResult)
	{
		User  authUser = userDetails.getUser();
		
		if(bindingResult.hasErrors())
		{
			throw new BlogException("Invalid Input", HttpStatus.BAD_REQUEST);
		}
		
		if(authUser.getId() != request.getUserId().longValue())
		{
			throw new BlogException("Unauthorized", HttpStatus.NOT_FOUND);
		}
		
		boolean alreadyLiked = likeService.isLiked(request.getUserId(),request.getBlogId());
		
		if(alreadyLiked)
		{
			throw new BlogException("Blog Already Liked", HttpStatus.BAD_REQUEST);
		}
		
		Blog findBlog = blogService.findById(request.getBlogId());
		if(findBlog==null)
		{
			throw new BlogException("Blog Not Found", HttpStatus.NOT_FOUND);
		}
		User findUser  = userService.findById(request.getUserId());
		
		if(findUser ==null)
		{
			throw new BlogException("User Not Found", HttpStatus.NOT_FOUND);
		}
		
		BlogLike newLike = new BlogLike();
		newLike.setBlog(findBlog);
		newLike.setCreatedAt(LocalDateTime.now());
		newLike.setUser(findUser);
		newLike = likeService.create(newLike);
		
		return ResponseEntity.ok(new ApiResponse<>("success", "Blog Liked successfully", null));
	}
	
	
	@PostMapping("/secure/dislike")
	public ResponseEntity<ApiResponse<?>> disLikeBlog(
			@AuthenticationPrincipal CustomUserDetails userDetails ,
			@Valid @RequestBody LikeRequest request , 
			BindingResult bindingResult)
	{
		User  authUser = userDetails.getUser();
		
		if(bindingResult.hasErrors())
		{
			throw new BlogException("Invalid Input", HttpStatus.BAD_REQUEST);
		}
		
		if(authUser.getId() != request.getUserId().longValue())
		{
			throw new BlogException("Unauthorized", HttpStatus.NOT_FOUND);
		}
		
		boolean alreadyLiked = likeService.isLiked(request.getUserId(),request.getBlogId());
		
		if(!alreadyLiked)
		{
			throw new BlogException("Blog is still not Liked", HttpStatus.NOT_FOUND);
		}
		
		Blog findBlog = blogService.findById(request.getBlogId());
		if(findBlog==null)
		{
			throw new BlogException("Blog Not Found", HttpStatus.NOT_FOUND);
		}
		User findUser  = userService.findById(request.getUserId());
		
		if(findUser ==null)
		{
			throw new BlogException("User Not Found", HttpStatus.NOT_FOUND);
		}
		
		likeService.deleteByUserIdAndBlogId(request.getUserId(),request.getBlogId());
		
		
		return ResponseEntity.ok(new ApiResponse<>("success", "Blog Liked successfully", null));
	}
	
	
	@PostMapping("/public/")
	public ResponseEntity<ApiResponse<?>> getAllLikeByBlog(
			@RequestParam Integer id,
			@RequestParam(required = false , defaultValue = "0" )Integer page,
			@RequestParam(required = false , defaultValue = "10" ) Integer limit
			
			)
	{
		
		Pageable pageable = PageRequest.of(page, limit , Sort.by("id").descending());
		
		Page<BlogLikeDTO> likes = likeService.getAllLikeOfBlog(id, pageable).map(like->{
			BlogLikeDTO blogLikeDTO = new BlogLikeDTO();
			blogLikeDTO.setBlogId(like.getBlog().getId().intValue());
			blogLikeDTO.setId(like.getId());
			blogLikeDTO.setUser(like.getUser().getName());
			blogLikeDTO.setUserId(like.getUser().getId().intValue());
			return blogLikeDTO;
			
		});
		
		
		return ResponseEntity.ok(new ApiResponse<>("success", "Blog Liked successfully",likes));
	}
	
	
	
	
	

}
