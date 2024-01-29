package com.example.bitory;

import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class ServerRunningCheck {

    @GetMapping("/")
    public ResponseEntity<?> runningCheck() {
        log.info("안돼요 돌아버린 서버를 다시 끝낼 순 없어요");
        return ResponseEntity.ok().body("Let it be");
    }
}
