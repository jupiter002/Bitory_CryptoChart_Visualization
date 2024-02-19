//package com.example.bitory.user.service;
//
//import com.example.bitory.user.dto.request.LoginRequestDTO;
//import com.example.bitory.user.dto.request.UserSignUpRequestDTO;
//import com.example.bitory.user.dto.response.LoginResponseDTO;
//import com.example.bitory.user.dto.response.UserSignUpResponseDTO;
//import com.example.bitory.user.entity.User;
//import com.example.bitory.user.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class UserService {
//
//    private final UserRepository userRepository;
////    private final PasswordEncoder encoder;
////    private final TokenProvider tokenProvider;
//
//    public UserSignUpResponseDTO create(UserSignUpRequestDTO RequestDTO) {
//
//    User saved = userRepository.save(RequestDTO.toEntity());
//
//    return new UserSignUpResponseDTO(saved);
//    }
//    //int
//
//    //testcode
//    /* 24.02.01
//     * Author: CYJ(최용준)
//     * function: authenticate(인증)
//     * */
//    public LoginResponseDTO authenticate(final LoginRequestDTO dto) {
//
//        //이메일을 통해 회원 정보를 조회.
//        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow(
//                () -> new RuntimeException("가입된 회원이 아닙니다.")
//        );
//
//        //비밀번호 검증
//        String rawPassword = dto.getPassword(); //사용자가 입력한 비번
//        String encodedPassword = user.getPassword(); //DB에 저장된 비번
//
//        if(!rawPassword.equals(encodedPassword)) {
//            throw new RuntimeException("비밀번호가 일치하지 않음");
//        }
//
////        if(!encoder.matches(rawPassword, encodedPassword)) {
////            throw new RuntimeException("비밀번호가 틀렸습니다.");
////        }
//
//        log.info("{}님 로그인 성공!", user.getUserName());
//
//       /*로그인 성공 후에 클라이언트에게 뭘 리턴할 것인가?
//          -> JWT를 클라이언트에게 발급 해 줘야 함 */
////        String token = tokenProvider.createToken(user);
//
////        return new LoginResponseDTO(user, token);
//        return new LoginResponseDTO(user);
//    }
//
//}
