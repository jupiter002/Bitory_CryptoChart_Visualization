package com.example.bitory.auth;

import com.example.bitory.user.entity.Role;
import lombok.*;

@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfo {
    private String userId;
    private String email;
    private Role role;
}
