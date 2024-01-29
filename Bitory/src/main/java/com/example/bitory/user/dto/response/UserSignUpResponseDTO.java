package com.example.bitory.user.dto.response;

import com.example.bitory.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UserSignUpResponseDTO {

    private String email;

    private String userName;

    private LocalDateTime joinDate;

    public UserSignUpResponseDTO(User user) {
        this.email = user.getEmail();
        this.userName = user.getUserName();
        this.joinDate = user.getJoinDate();
    }

}
