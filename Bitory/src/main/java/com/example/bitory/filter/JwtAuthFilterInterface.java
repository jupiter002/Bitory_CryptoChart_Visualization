package com.example.bitory.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface JwtAuthFilterInterface {
    // 필터가 해야할 작업을 기술
    void doFilterInternal(HttpServletRequest request,
                          HttpServletResponse response,
                          FilterChain filterChain)
            throws ServletException, IOException;
}
