package com.example.bitory.order.dto.request;

import com.example.bitory.order.entity.Order;
import com.example.bitory.user.entity.User;
import lombok.*;

@Getter @Setter
@ToString
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OrderCreateRequestDTO {

    private String orderId;

    public Order toEntity() {
        return Order.builder()
                .orderId(this.orderId)
                .build();
    }

    /* dto를 Entity로 변환 */
    public Order toEntity(User user) {
        return Order.builder()
                .orderId(this.orderId)
                .user(user)
                .build();
    }
}
