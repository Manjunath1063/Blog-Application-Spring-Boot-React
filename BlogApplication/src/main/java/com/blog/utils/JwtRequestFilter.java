package com.blog.utils;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blog.service.CustomUserDetailsService;

import java.io.IOException;
import java.util.Collection;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
	private final JwtUtil jwtUtil;
	private final CustomUserDetailsService customUserDetailsService;

	public JwtRequestFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
		this.jwtUtil = jwtUtil;
		this.customUserDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {

		final String authorizationHeader = request.getHeader("Authorization");

		if (authorizationHeader != null) {

			String email = null;
			String jwt = null;

			if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
				jwt = authorizationHeader.substring(7);
				email = jwtUtil.extractSubject(jwt);
			}

			if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

				UserDetails userDetails = null;

				userDetails = customUserDetailsService.loadUserByUsername(email);

				Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities() != null
						? userDetails.getAuthorities()
						: null;

				var authToken = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
						userDetails, null, authorities);
				authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(authToken);
			}
		}

		chain.doFilter(request, response);
	}
}
