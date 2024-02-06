package com.example.bitory.order.service;

import com.example.bitory.auth.TokenUserInfo;
import com.example.bitory.order.dto.request.OrderCreateRequestDTO;
import com.example.bitory.order.dto.response.OrderListResponseDTO;
import com.example.bitory.order.entity.Order;
import com.example.bitory.order.repository.OrderRepository;
import com.example.bitory.user.entity.User;
import com.example.bitory.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;


    public OrderListResponseDTO payment(
            OrderCreateRequestDTO requestDTO,
            TokenUserInfo userInfo //로그인된 유저 정보로 변경 필요?

    ) {

        //유저 정보에서 아이디를 찾아 Entity 타입으로 받기
        User foundUser = getUser(userInfo.getUserId());

        //requestDTO에 찾은 유저 정보를 넘겨 Entity 로 변환
        Order order = requestDTO.toEntity(foundUser);

        //주문 레파지토리에 주문 정보 저장
        orderRepository.save(order);

        return retrive(String.valueOf(foundUser));
    }

    public OrderListResponseDTO retrive(String userId) {

        //로그인한 유저의 정보 조회
        User user = getUser(userId);

        List<Order> entityList = orderRepository.findAllByUser(user);

        List<OrderListResponseDTO> dtoList = entityList.stream()
                .map(OrderListResponseDTO::new)
                .toList();

        return (OrderListResponseDTO) dtoList;
    }

    private User getUser(String userId) {
        return userRepository.findById(userId).orElseThrow();
    }

    private Order getBill(String orderId) {
        return orderRepository.findById(orderId).orElseThrow();
    }

}
//test