package com.blog.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.blog.dto.UserDTO;
import com.blog.entity.User;
import com.blog.exception.BlogException;
import com.blog.exception.UserException;
import com.blog.request.UserSignInRequest;
import com.blog.request.UserSignupRequest;
import com.blog.request.UserUpdateRequest;
import com.blog.response.ApiResponse;
import com.blog.response.UserProfileResponse;
import com.blog.service.CustomUserDetails;
import com.blog.service.ICloudinaryService;
import com.blog.service.IUserService;
import com.blog.utils.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
public class UserController {
	@Autowired
	private JwtUtil jwtUtil;

	@Autowired
	private IUserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private ICloudinaryService cloudinaryService;
 
	@PostMapping("/public/signup")
	ResponseEntity<?> userSignUp(@Valid @RequestBody UserSignupRequest request, BindingResult bindingResult) {

		System.out.println(request);
		
		if (bindingResult.hasErrors()) {
			throw new UserException("Invalid User Input", HttpStatus.BAD_REQUEST);
		}

		User findUser = userService.findByEmail(request.getEmail());

		if (findUser != null) {
			throw new UserException("Email ALready Exists", HttpStatus.CONFLICT);
		}

		User user = new User();
		user.setEmail(request.getEmail());
		user.setName(request.getName());
		user.setPassword(passwordEncoder.encode(request.getPassword()));

		user = userService.create(user);

		Map<String, Object> claims = new HashMap<>();
		claims.put("email", user.getEmail());
		claims.put("role", "user");
		claims.put("userId", user.getId());
		String token = jwtUtil.generateToken(user.getEmail(), claims);
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Account created Successfully");
		response.put("token", token);
		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	@PostMapping("/public/signin")
	ResponseEntity<?> userSignIn(@Valid @RequestBody UserSignInRequest request, BindingResult bindingResult) {

		if (bindingResult.hasErrors()) {
			throw new UserException("Invalid User Input", HttpStatus.BAD_REQUEST);
		}

		User user = userService.findByEmail(request.getEmail());

		if (user == null) {
			throw new UserException("Email Not Found", HttpStatus.NOT_FOUND);
		}
		
		if(!passwordEncoder.matches(request.getPassword(), user.getPassword()))
		{
			throw new UserException("Invalid Password", HttpStatus.UNAUTHORIZED);
		}
		
		Map<String, Object> claims = new HashMap<>();
		claims.put("email", user.getEmail());
		claims.put("role", "user");
		claims.put("userId", user.getId());
		String token = jwtUtil.generateToken(user.getEmail(), claims);
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "Logged In Successfully");
		response.put("token", token);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	
	@GetMapping("/secure/profile")
	ResponseEntity<?> getUserProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
		User user = userDetails.getUser();
		Map<String, Object> response = new HashMap<>();
		response.put("status", "success");
		response.put("user", user);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	@GetMapping("/public/profile/{id}")
	public ResponseEntity<ApiResponse<?>> getUserProfile(
			@PathVariable Integer id)
	{
		User findUser = userService.findById(id);
		if(findUser ==null)
		{
			throw new BlogException("User not found", HttpStatus.NOT_FOUND);
		}
		
		UserProfileResponse userDTO = new UserProfileResponse();
		userDTO.setEmail(findUser.getEmail());
		userDTO.setId(findUser.getId());
		userDTO.setName(findUser.getName());
		userDTO.setPassword(null);
		userDTO.setBlogsCount(findUser.getBlogs().size());
		userDTO.setImg(findUser.getProfileImgUrl());
		
		return ResponseEntity.ok(new ApiResponse<>("success","Profile Data", userDTO));
		
	}
	
	
	@PutMapping(value = "/secure/update" , consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
	public ResponseEntity<ApiResponse<?>> updateUserProfile(
	        @AuthenticationPrincipal CustomUserDetails customUserDetails,
	        @RequestParam(name = "img" ,required = false) MultipartFile imageFile,
	        @RequestParam String name,
	        @RequestParam String isChanged,
	        @RequestParam(required = true) Integer userId
	) {
		
	    if (customUserDetails.getUser().getId() != userId.longValue()) {
	        throw new BlogException("Unauthorized", HttpStatus.UNAUTHORIZED);
	    }
		


	    User findUser = userService.findById(userId);
	    if (findUser == null) {
	        throw new BlogException("User not found", HttpStatus.NOT_FOUND);
	    }

	    if (imageFile != null && imageFile.getSize() > 2 * 1024 * 1024) {
	        throw new BlogException("Image size must be less than 2MB", HttpStatus.BAD_REQUEST);
	    }
//
	   
//
	    if(isChanged.equalsIgnoreCase("true"))
	    {
	    		 if (findUser.getProfileImgUrlPublicId() != null) {
		 	        cloudinaryService.deleteFile(findUser.getProfileImgUrlPublicId());
		 	        findUser.setProfileImgUrl(null);
		 	        findUser.setProfileImgUrlPublicId(null);
		 	    }
	    		 
	    		 if(imageFile != null)
	    		 {
	    			 Map uploadResult = cloudinaryService.uploadFile(imageFile);
	 		        findUser.setProfileImgUrl((String) uploadResult.get("secure_url"));
	 		        findUser.setProfileImgUrlPublicId((String) uploadResult.get("public_id"));
	    			 
	    		 }
		    	
		        
	    }
//
	    findUser.setName(name);
	    findUser = userService.update(findUser);

	    return ResponseEntity.ok(new ApiResponse<>("success", "Profile Updated Successfully", null));
	}

	
	
	
	
	
	
	
	
	
	

}
