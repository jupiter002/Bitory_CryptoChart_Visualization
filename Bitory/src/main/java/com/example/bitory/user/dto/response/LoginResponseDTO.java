package com.example.bitory.user.dto.response;

import com.example.bitory.user.entity.User;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;

@Getter @ToString @EqualsAndHashCode
@NoArgsConstructor @AllArgsConstructor
@Builder
public class LoginResponseDTO {

    /* 24.02.01
     * Author: CYJ
     * class: LoginResponseDTO
     * */

    private String email;
    private String userName;

    @JsonFormat(pattern = "yyyy년 MM월 dd일")
    private LocalDate joinDate;
    private String token; // 인증 토큰
    private String role;  // 권한

    //User 정보와 Token을 이용하여 dto를 이용하는 생성자
    public LoginResponseDTO(User user) {
        this.email =  user.getEmail();
        this.userName = user.getUserName();
        this.joinDate = LocalDate.from(user.getJoinDate());
//        this.token = token;
        this.role = String.valueOf(user.getRole());
    }

    //else
}
