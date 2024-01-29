package com.example.bitory.user.dto.request;

import com.example.bitory.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(of = "email")
@ToString @Builder
public class UserSignUpRequestDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private String userName;

    public User toEntity() {
        return User.builder()
                .email(this.email)
                .password(this.password)
                .userName(this.userName)
                .build();
    }

}
