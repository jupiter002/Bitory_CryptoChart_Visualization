package com.example.bitory.auth;

import com.example.bitory.user.entity.Role;
import com.example.bitory.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

// 역할: 토큰을 발급하고, 서명 위조를 검사하는 객체
@Component
@Slf4j
public class TokenProvider {

    // 서명에 사용할 값 (512비트 이상의 랜덤 문자열)
    @Value("${jwt.secret}") //from <application.yml> made by <todoApplicationTest>
    private String SECRET_KEY = "";

    //토큰 생성 메서드

    /**
     * JSON Web Token을 생성하는 메서드
     *
     * @param userEntity - 토큰의 내용(클레임)에 포함될 유저 정보
     * @return - 생성된 JSON을 암호화한 토큰값.
     */
    public String createToken(User userEntity) {

        //토큰 만료시간 생성
        Date expiry = Date.from(
                Instant.now().plus(1, ChronoUnit.DAYS)
        );

        // 추가 클레임 정의
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", userEntity.getEmail());

        // 토큰 생성
        return Jwts.builder()
                //token header에 들어갈 서명
                .signWith(
                        Keys.hmacShaKeyFor(SECRET_KEY.getBytes()),
                        SignatureAlgorithm.HS512
                )
                //token payload에 들어갈 클레임 설정
                .setClaims(claims) //추가 클레임은 먼저 설정해야 한다
                .setIssuer("bitory") // iss: 발급자 정보 (필수)
                .setIssuedAt(new Date()) //iat: 발급 시간 (필수)
                .setExpiration(expiry) //exp: 만료 시간 (필수)
                .setSubject(userEntity.getId()) //sub: 토큰을 식별할 수 있는 주요 데이터
                .compact();
    }

    /**
     * 클라이언트가 전송한 토큰을 디코딩하여 토큰의 위조 여부를 확인
     * 토큰을 json으로 파싱해서 클레임(토큰 정보)를 리턴
     *
     * @param token
     * @return - 토큰 안에 있는 인증된 유저 정보를 반환
     */
    public TokenUserInfo validateAndGetTokenUserInfo(String token) {

        Claims claims = Jwts.parserBuilder()
                // 토큰 발급자의 발급 당시의 서명을 넣어줌
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                // 서명 위조 검사: 위조된 경우에는 예외가 발생합니다.
                // 위조가 되지 않은 경우 페이로드를 리턴.
                .build()
                .parseClaimsJws(token)
                .getBody();

        log.info("claims: {}", claims);

        return TokenUserInfo.builder()
                .userId(claims.getSubject())
                .email(claims.get("email", String.class))
                .build();
    }

}