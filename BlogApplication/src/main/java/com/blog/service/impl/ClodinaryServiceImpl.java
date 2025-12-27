package com.blog.service.impl;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.blog.exception.BlogException;
import com.blog.service.ICloudinaryService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class ClodinaryServiceImpl implements ICloudinaryService {

	@Autowired
	private Cloudinary cloudinary;
	
	@Override
	public Map uploadFile(MultipartFile file) {
		// TODO Auto-generated method stub
		 try {
			return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
		} catch (IOException e) {
			e.printStackTrace();
			throw new BlogException("Failed to Upload file", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public boolean deleteFile(String publicId) {
		try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
        	e.printStackTrace();
            throw new BlogException("Failed to delete file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
	}

}
