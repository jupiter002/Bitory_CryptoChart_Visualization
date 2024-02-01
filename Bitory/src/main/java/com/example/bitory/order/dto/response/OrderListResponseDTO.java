package com.example.bitory.order.dto.response;

import com.example.bitory.order.entity.Order;
import lombok.*;

@Getter @Setter
@ToString @EqualsAndHashCode
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OrderListResponseDTO {

    private String OrderId;

    public OrderListResponseDTO(Order order) {
        this.OrderId = order.getOrderId();
    }

}
