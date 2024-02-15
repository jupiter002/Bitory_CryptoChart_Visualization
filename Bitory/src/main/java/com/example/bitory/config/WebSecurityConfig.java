package com.example.bitory.config;


import com.example.bitory.filter.JwtAuthFilter;
import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.session.AbstractSessionEvent;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.filter.CorsFilter;

    @EnableWebSecurity //시큐리티 설정 파일로 사용할 클래스 선언(@Configuration이 포함)
    @RequiredArgsConstructor
    @EnableGlobalMethodSecurity(prePostEnabled = true) // 자동 권한 검사를 수행하기 위한 설정.
    public class WebSecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private static final String[] SWAGGER_URL_ARRAY = {
                /* Swagger V2 */
                "/api/v2/**",
                "/health",
                "/swagger-ui.html",
                "/swagger/**",
                "/swagger-resources",
                "/swagger-resources/**",
                "configuration/ui",
                "configuration/security",
                "/webjars/**",
                "/v2/api-docs",
                /* Swagger V3 */
                "/v3/api-docs/**",
                "/swagger-ui/**"
        };

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        //시큐리티 설정
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

            // Security 모듈이 기본적으로 제공하는 보안 정책 해제
            http
                    .cors(Customizer.withDefaults())
                    .csrf(AbstractHttpConfigurer::disable)
//                    .httpBasic(AbstractHttpConfigurer::disable)
                    // 세션 인증을 사용하지 않겠다
                    .sessionManagement(configurer -> {
                        try {
                            configurer
                                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                            // 어떤 요청에서 인증을 안 할 것인지, 언제 할 것인지
                            .disable().authorizeHttpRequests(authorize -> authorize
                                            .requestMatchers("/", "/api/auth/**").permitAll() //localhost:8181
                                            .requestMatchers(SWAGGER_URL_ARRAY).permitAll()
                                            .anyRequest().authenticated());
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    });

            // authenticated: 검증 필요, denyAll: 모두 거부, permitAll: 모두 허용


            // 토큰 인증 필터 연결
            http.addFilterAfter(
                    (Filter) jwtAuthFilter,
                    CorsFilter.class // import 주의: 스프링 걸로
            );

            return http.build();
        }
    }


