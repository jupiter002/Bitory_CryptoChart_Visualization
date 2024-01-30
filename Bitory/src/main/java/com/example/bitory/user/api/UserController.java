package com.example.bitory.user.api;

import com.example.bitory.user.dto.request.UserSignUpRequestDTO;
import com.example.bitory.user.dto.response.UserSignUpResponseDTO;
import com.example.bitory.user.entity.User;
import com.example.bitory.user.repository.UserRepository;
import com.example.bitory.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody UserSignUpRequestDTO requestDTO
    ) {
//        User newUser = this.userRepository.save(user);

        UserSignUpResponseDTO responseDTO = userService.create(requestDTO);

        return ResponseEntity.ok().body(responseDTO);
    }

    //main2


}
