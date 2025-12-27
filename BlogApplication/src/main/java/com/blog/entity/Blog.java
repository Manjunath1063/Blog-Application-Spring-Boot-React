package com.blog.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500000)
    private String content;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @JsonIgnore
    @OneToMany(mappedBy = "blog")
    private List<BlogLike> likes;
    
    @Size(max = 5000)
    private String hashTags;
    
    @Size(max = 5000)
    private String img;
    
    
    private LocalDateTime createdAt;
    
    
    @JsonIgnore
    @OneToMany(mappedBy = "blog")
    private List<BlogComment> comments;
    
}
