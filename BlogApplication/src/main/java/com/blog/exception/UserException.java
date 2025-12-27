package com.blog.exception;

import org.springframework.http.HttpStatus;

public class UserException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	private HttpStatus httpStatus;

	public UserException(String message , HttpStatus httpStatus) {
		super(message);
		this.httpStatus = httpStatus;
		this.httpStatus = httpStatus!=null ? httpStatus : HttpStatus.INTERNAL_SERVER_ERROR;	
	}

	public HttpStatus getHttpStatus() {
		return httpStatus;
	}
}
