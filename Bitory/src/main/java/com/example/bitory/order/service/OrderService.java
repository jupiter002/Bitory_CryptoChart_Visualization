package com.example.bitory.order.service;

import com.example.bitory.order.dto.request.OrderCreateRequestDTO;
import com.example.bitory.order.dto.response.OrderListResponseDTO;
import com.example.bitory.order.entity.Order;
import com.example.bitory.order.repository.OrderRepository;
import com.example.bitory.user.dto.response.UserSignUpResponseDTO;
import com.example.bitory.user.entity.User;
import com.example.bitory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

//    public OrderListResponseDTO payment(
//            OrderCreateRequestDTO requestDTO,
//            User user //로그인된 유저 정보로 변경 필요?
//
//    ) {
//
//        //로그인된 유저 정보에서 아이디를 찾아 Entity 타입으로 받기
//        User foundUser = getUser(user.getId());
//
//        //OrderRequestDTO에 찾은 유저 정보를 넘겨주고 Entity 로 변환
//        Order order = requestDTO.toEntity(foundUser);
//
//        //주문 레파지토리에 주문 정보 저장
//        orderRepository.save(order);
//
//        return retrive(user.getId());
//    }
//
//    public OrderListResponseDTO retrive(String userId) {
//
//        User user = getUser(userId);
//
//        List<Order> entityList = orderRepository.findAllByUser(user);
//
//        List<OrderListResponseDTO> dtoList = entityList.stream()
//                .map(OrderListResponseDTO::new)
//                .toList();
//
//        return OrderListResponseDTO;
//    }

    private User getUser(String userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    private Order getBill(String orderId) {
        return orderRepository.findById(orderId).orElseThrow();
    }

}
