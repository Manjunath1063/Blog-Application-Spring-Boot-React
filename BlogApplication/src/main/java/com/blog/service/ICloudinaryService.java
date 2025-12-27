package com.blog.service;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface ICloudinaryService {
   public Map uploadFile(MultipartFile file);
   public boolean deleteFile(String publicId);
}
