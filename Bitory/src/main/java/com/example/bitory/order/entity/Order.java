package com.example.bitory.order.entity;

import com.example.bitory.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

@Getter @Setter
@ToString @Builder
@NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "tbl_order")
public class Order {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid")
    private String orderId; //주문 PK

    @Enumerated(EnumType.STRING)
    private AssetType assetType; //자산 타입

    private int orderQuantity; //주문 수량

    private int orderPrice; //주문 금액

    private int totalPayment; //총 결제 금액

    @CreationTimestamp
    private LocalDateTime orderDate; //주문 일시

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;






}
