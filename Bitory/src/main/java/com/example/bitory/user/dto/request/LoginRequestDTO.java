package com.example.bitory.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @ToString @Builder
@EqualsAndHashCode
@NoArgsConstructor  @AllArgsConstructor
public class LoginRequestDTO {
    /* 24.02.01
     * Author: CYJ
     * class: LoginRequestDTO
     * */

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

}
