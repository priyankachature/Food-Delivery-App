package com.fooddelivery.fooddeliverybackend.repository;

import com.fooddelivery.fooddeliverybackend.entity.Address;
import com.fooddelivery.fooddeliverybackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

	List<Address> findByUser(User user);
//	List<Address> findByUser_Id(Long userId);
	Address findByUserAndIsDefaultTrue(User user);

}