package com.example.bitory.Controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;


@Controller
@RequestMapping("/member")
public class JoinController {


	
	@GetMapping("/join")
    public String list() {

        return "member/join";
    }


    @GetMapping("/myPage")
    public String myPage() {

        return "member/myPage";
    }



}
