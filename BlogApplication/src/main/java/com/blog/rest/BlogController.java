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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blog.dto.BlogDTO;
import com.blog.entity.Blog;
import com.blog.entity.User;
import com.blog.exception.BlogException;
import com.blog.request.CreateBlogRequest;
import com.blog.response.ApiResponse;
import com.blog.service.CustomUserDetails;
import com.blog.service.IBlogService;
import com.blog.service.ILikeService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/blog")
public class BlogController {

	@Autowired
	private IBlogService blogService;

	@Autowired
	private ILikeService likeService;

	@PostMapping("/secure/create")
	public ResponseEntity<ApiResponse<?>> createBlog(
			@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@Valid @RequestBody CreateBlogRequest request, 
			BindingResult bindingResult) {

		if (bindingResult.hasErrors()) {
			throw new BlogException("Invalid Input data", HttpStatus.BAD_REQUEST);
		}

		User user = customUserDetails.getUser();

		Blog blog = new Blog();
		blog.setAuthor(user);
		blog.setContent(request.getContent());

		blog.setHashTags(request.getHashTags());
		blog.setImg(request.getImg());
		blog.setTitle(request.getTitle());
		blog.setCreatedAt(LocalDateTime.now());
		blog = blogService.create(blog);
		return ResponseEntity.ok(new ApiResponse<>("success","Blog created Successfully", null));

	}

	@PutMapping("/secure/update/{id}")
	public ResponseEntity<ApiResponse<?>> upadetBlog(
			@PathVariable Integer id, 
			@Valid @RequestBody CreateBlogRequest request,
			BindingResult bindingResult) {

		if (bindingResult.hasErrors()) {
			throw new BlogException("Invalid Input data", HttpStatus.BAD_REQUEST);
		}

		Blog blog = blogService.findById(id);

		if (blog == null) {
			throw new BlogException("Blog Not Found", HttpStatus.NOT_FOUND);
		}

		blog.setContent(request.getContent());

		blog.setHashTags(request.getHashTags());
		blog.setImg(request.getImg());
		blog.setLikes(blog.getLikes());
		blog.setTitle(request.getTitle());

		blog = blogService.update(blog);
		return ResponseEntity.ok(new ApiResponse<>("success","Blog updated Successfully", null));

	}

	@DeleteMapping("/secure/delete/{id}")
	public ResponseEntity<ApiResponse<?>> deleteBlog(@PathVariable Integer id) {

		Blog blog = blogService.findById(id);

		if (blog == null) {
			throw new BlogException("Blog Not Found", HttpStatus.NOT_FOUND);
		}

		blogService.deleteById(id);
		return ResponseEntity.ok(new ApiResponse<>("success","Blog deleted Successfully", null));

	}
	
	@GetMapping("/public/{id}")
	public ResponseEntity<ApiResponse<?>> getBlogById(
			@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@PathVariable Integer id,
			@RequestParam(required = false, defaultValue = "1") Integer page,
			@RequestParam(required = false, defaultValue = "10") Integer limit) {

		    Blog blog = blogService.findById(id);
		    
		    if(blog ==null)
		    {
		    	throw new BlogException("Blog Not Found", HttpStatus.NOT_FOUND);
		    }
		    
			BlogDTO blogDTO = new BlogDTO();
			User user = blog.getAuthor();
			user.setPassword(null);
			blogDTO.setAuthor(user);
			blogDTO.setContent(blog.getContent());
			blogDTO.setId(blog.getId());
			blogDTO.setTitle(blog.getTitle());
			blogDTO.setLikes(Long.parseLong(blog.getLikes().size() + ""));
			blogDTO.setComments(Long.parseLong(blog.getComments().size()+""));
			blogDTO.setImg(blog.getImg());
			blogDTO.setHashTags(blog.getHashTags());
			blogDTO.setCreatedAt(blog.getCreatedAt());
			blogDTO.setLiked(customUserDetails == null ? false
					: likeService.isLiked(customUserDetails.getUser().getId().intValue(), blog.getId().intValue()));
		
		return ResponseEntity.ok(new ApiResponse<>("success","Blog Result", blogDTO));

	}

	@GetMapping("/public/")
	public ResponseEntity<ApiResponse<?>> getBlogs(
			@AuthenticationPrincipal CustomUserDetails customUserDetails,
			@RequestParam(required = false, defaultValue = "") String q,
			@RequestParam(required = false, defaultValue = "1") Integer page,
			@RequestParam(required = false, defaultValue = "10") Integer limit) {

		Pageable pageable = PageRequest.of(page, limit, Sort.by("id").descending());
		Page<Blog> blogs = blogService.findAll(q, pageable);
		Page<BlogDTO> blogsResponse = blogs.map(blog -> {
			BlogDTO blogDTO = new BlogDTO();
			User user = blog.getAuthor();
			user.setPassword(null);
			blogDTO.setAuthor(user);
			blogDTO.setContent(blog.getContent());
			blogDTO.setId(blog.getId());
			blogDTO.setTitle(blog.getTitle());
			blogDTO.setLikes(Long.parseLong(blog.getLikes().size() + ""));
			blogDTO.setComments(Long.parseLong(blog.getComments().size()+""));
			blogDTO.setImg(blog.getImg());
			blogDTO.setHashTags(blog.getHashTags());
			blogDTO.setCreatedAt(blog.getCreatedAt());
			blogDTO.setLiked(customUserDetails == null ? false
					: likeService.isLiked(customUserDetails.getUser().getId().intValue(), blog.getId().intValue()));
			return blogDTO;
		});
		return ResponseEntity.ok(new ApiResponse<>("success","Blog Result", blogsResponse));

	}

	@GetMapping("/public/user/{id}")
	public ResponseEntity<ApiResponse<?>> getBlogsUserId(
			@PathVariable Integer id,
			@RequestParam(required = false, defaultValue = "0") Integer page,
			@RequestParam(required = false, defaultValue = "10") Integer limit) {

		Pageable pageable = PageRequest.of(page, limit, Sort.by("id").descending());
		Page<Blog> blogs = blogService.findByUserId(id, pageable);
		Page<BlogDTO> blogsResponse = blogs.map(blog -> {

			BlogDTO blogDTO = new BlogDTO();
			User user = blog.getAuthor();
			user.setPassword(null);
			blogDTO.setAuthor(user);
			blogDTO.setContent(blog.getContent());
			blogDTO.setId(blog.getId());
			blogDTO.setLikes(Long.parseLong(blog.getLikes().size() + ""));
			blogDTO.setComments(Long.parseLong(blog.getComments().size()+""));
			blogDTO.setTitle(blog.getTitle());
			blogDTO.setImg(blog.getImg());
			blogDTO.setHashTags(blog.getHashTags());
			return blogDTO;
		});

		return ResponseEntity.ok(new ApiResponse<>("success","Blog Result", blogsResponse));

	}

}
