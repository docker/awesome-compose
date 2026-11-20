package com.company.project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;

@Entity
@Table(name = "greetings")
public class Greeting {

    @Id
    @GeneratedValue
    private int id;
    @Column(nullable = false)
    private String name;

    public Greeting() {
    }

    public Greeting(String name) {
        this.name = name;
    }

    public Greeting(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Greeting greeting = (Greeting) o;

        return name.equals(greeting.name);
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }
}
