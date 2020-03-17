package com.company.project.repository;

import com.company.project.entity.Greeting;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GreetingRepository extends CrudRepository<Greeting, Integer> {
}