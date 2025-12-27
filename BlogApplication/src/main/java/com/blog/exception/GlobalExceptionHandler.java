package com.blog.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(UserException.class)
	public ResponseEntity<Map<String, Object>> handleCanddidateException(UserException userException)
	{
		Map<String,Object> errorResponse = new HashMap<>();
		errorResponse.put("status", "failure");
		errorResponse.put("type","User Exception");
		errorResponse.put("error", userException.getMessage());
		errorResponse.put("localTime", LocalDateTime.now());
		errorResponse.put("status", userException.getHttpStatus().toString());
		return new ResponseEntity<Map<String,Object>>(errorResponse, userException.getHttpStatus());
		
	}
	
	@ExceptionHandler(BlogException.class)
	public ResponseEntity<Map<String, Object>> handleBlogException(BlogException blogException)
	{
		Map<String,Object> errorResponse = new HashMap<>();
		errorResponse.put("status", "failure");
		errorResponse.put("type","Blog Exception");
		errorResponse.put("error", blogException.getMessage());
		errorResponse.put("localTime", LocalDateTime.now());
		errorResponse.put("status", blogException.getHttpStatus().toString());
		return new ResponseEntity<Map<String,Object>>(errorResponse, blogException.getHttpStatus());
		
	}
	
}
