package com.blog.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LikeRequest 
{
  @NotNull
  private Integer blogId;
  
  @NotNull
  private Integer userId;
}
