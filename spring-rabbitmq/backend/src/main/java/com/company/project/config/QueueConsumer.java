package com.company.project.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.company.project.model.Message;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class QueueConsumer {

    private final RabbitTemplate rabbitTemplate;

    @Value("${queue.name}")
    private String queueName;

    @Autowired
    public QueueConsumer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    private String receiveMessage() {
        String message = (String) rabbitTemplate.receiveAndConvert(queueName);
        return message;
    }

    public Message processMessage() throws JsonProcessingException {
        String message = receiveMessage();
        return new ObjectMapper().readValue(message, Message.class);
    }
}
