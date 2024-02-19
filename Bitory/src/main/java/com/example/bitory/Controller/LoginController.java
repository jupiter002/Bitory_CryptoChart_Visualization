package com.example.bitory.Controller;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpSession;


@Controller
@RequestMapping("/member")
@RequiredArgsConstructor
public class LoginController {


    @GetMapping("/login")
    public String login() {

        return "member/login";
    }
    
    @GetMapping("/logout")
    public String logout(HttpSession sess) {

        sess.invalidate();

        // logout하면 index 페이지로 넘어감
        return "redirect:/index";
    }
    @GetMapping("/findId")
    public String find() {

        return "member/findId";
    }

    @GetMapping("/findPw")
    public String findPw() {

        return "member/findPw";
    }



}