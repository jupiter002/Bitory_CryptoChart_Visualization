package com.example.bitory.order.api;

import com.example.bitory.auth.UserInfo;
import com.example.bitory.order.dto.request.OrderCreateRequestDTO;
import com.example.bitory.order.dto.response.OrderListResponseDTO;
import com.example.bitory.order.service.OrderService;
import com.example.bitory.order.dto.request.OrderCreateRequestDTO;
import com.example.bitory.order.dto.response.OrderListResponseDTO;
import com.example.bitory.order.service.OrderService;
import com.example.bitory.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    public ResponseEntity<?> retrieveOrderList(UserInfo userInfo) {
        OrderListResponseDTO responseDTO = orderService.retrive(userInfo.getUserId());

        return ResponseEntity.ok().body(responseDTO);
    }

    @PostMapping("create")
    public ResponseEntity<?> createOrder(@RequestBody OrderCreateRequestDTO requestDTO, UserInfo userInfo) {

        OrderListResponseDTO responseDTO = orderService.payment(requestDTO, userInfo);

        return ResponseEntity.ok().body(responseDTO);

    }




}
