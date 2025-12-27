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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
 
import com.blog.dto.BlogCommentDTO;
import com.blog.entity.Blog;
import com.blog.entity.BlogComment;
import com.blog.entity.User;
import com.blog.exception.BlogException;
import com.blog.request.CommentRequest;
import com.blog.response.ApiResponse;
import com.blog.service.CustomUserDetails;
import com.blog.service.IBlogService;
import com.blog.service.ICommentService;
import com.blog.service.IUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

	@Autowired
	private IUserService userService;

	@Autowired
	private IBlogService blogService;

	@Autowired
	private ICommentService commentService;

	@PostMapping("/secure/create")
	public ResponseEntity<ApiResponse<?>> postComment(
			@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@Valid @RequestBody CommentRequest request, 
			BindingResult bindingResult) {
		if (bindingResult.hasErrors()) {
			throw new BlogException("Invalid Input Data", HttpStatus.BAD_REQUEST);
		}

		User authUser = customUserDetails.getUser();

		if (authUser.getId() != request.getUserId().longValue()) {
			throw new BlogException("Unauthorized", HttpStatus.UNAUTHORIZED);
		}

		User findUser = userService.findById(request.getUserId());
		if (findUser == null) {
			throw new BlogException("User Not Found", HttpStatus.NOT_FOUND);
		}

		Blog findBlog = blogService.findById(request.getBlogId());

		if (findBlog == null) {
			throw new BlogException("Blog Not Found", HttpStatus.NOT_FOUND);
		}

		BlogComment comment = new BlogComment();
		comment.setBlog(findBlog);
		comment.setComment(request.getComment());
		comment.setCreatedAt(LocalDateTime.now());
		comment.setUser(findUser);
		comment = commentService.create(comment);
		return ResponseEntity.ok(new ApiResponse<>("success", "Comment Added successfully", null));
	}

	@GetMapping("/public/blog")
	public ResponseEntity<ApiResponse<?>> getAllCommentOfBlog(
			@RequestParam Integer id, //Blog Id
			@RequestParam(required = false, defaultValue = "0") Integer page,
			@RequestParam(required = false, defaultValue = "10") Integer limit) {
		Pageable pageable = PageRequest.of(page, limit, Sort.by("id").descending());
		
		
		
		Page<BlogCommentDTO> comments = commentService.getAllCommentByBlog(id, pageable).map(comment -> {
			BlogCommentDTO commentDTO = new BlogCommentDTO();
			commentDTO.setBlogId(id);
			commentDTO.setComment(comment.getComment());
			commentDTO.setCreatedAt(comment.getCreatedAt());
			commentDTO.setId(comment.getId());
			commentDTO.setUserId(comment.getUser().getId().intValue());
			commentDTO.setUserName(comment.getUser().getName());
			return commentDTO;
		});
		return ResponseEntity.ok(new ApiResponse<>("success", "Comments for Blog", comments));
	}
	
	
	
}
