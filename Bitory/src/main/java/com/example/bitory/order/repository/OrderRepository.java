package com.example.bitory.order.repository;

import com.example.bitory.order.entity.Order;
import com.example.bitory.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {

    // 특정 회원의 구매 내역 리턴
    @Query("SELECT o FROM Order o WHERE o.user = :user")
    List<Order> findAllByUser(@Param("user") User user);
}
