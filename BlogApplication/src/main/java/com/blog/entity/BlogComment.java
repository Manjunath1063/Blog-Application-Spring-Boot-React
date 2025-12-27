package com.blog.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class BlogComment 
{
   
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Integer id;	
	
   @Column(nullable = false, length = 500000)	
   private String comment;
   
   @ManyToOne
   @JsonIgnore
   @JoinColumn(name = "userId")
   private User user;
   
   @ManyToOne
   @JsonIgnore
   @JoinColumn(name = "blogId")
   private Blog blog;
   
   private LocalDateTime createdAt;
   
}
