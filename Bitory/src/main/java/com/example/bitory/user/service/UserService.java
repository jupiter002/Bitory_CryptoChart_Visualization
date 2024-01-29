package com.example.bitory.user.service;

import com.example.bitory.user.dto.request.UserSignUpRequestDTO;
import com.example.bitory.user.dto.response.UserSignUpResponseDTO;
import com.example.bitory.user.entity.User;
import com.example.bitory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserSignUpResponseDTO create(UserSignUpRequestDTO RequestDTO) {

    User saved = userRepository.save(RequestDTO.toEntity());

    return new UserSignUpResponseDTO(saved);
    }

}
