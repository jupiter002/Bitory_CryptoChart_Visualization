package com.example.bitory.user.repository;

import com.example.bitory.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {

    /* 24.02.01
     * Author: CYJ
     * function: findByEmail(이메일로 회원정보 조회기능)
     * */
    Optional<User> findByEmail(String email); //Query Method
}
