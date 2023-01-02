package com.company.project.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.company.project.config.QueueConsumer;
import com.company.project.config.QueueProducer;
import com.company.project.model.Message;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/")
public class MessageController {

    private final QueueProducer queueProducer;
    private final QueueConsumer queueConsumer;

    public MessageController(QueueProducer queueProducer, QueueConsumer queueConsumer) {
        this.queueProducer = queueProducer;
        this.queueConsumer = queueConsumer;
    }

    @GetMapping("getMessage")
    public ResponseEntity<?> getMessage() throws JsonProcessingException {
        Message message = queueConsumer.processMessage();
        return new ResponseEntity<Message>(message, HttpStatus.OK);
    }

    @PostMapping("sendMessage")
    public ResponseEntity<?> sendMessage(@RequestBody Message message) throws JsonProcessingException {
        queueProducer.produce(message);
        return new ResponseEntity<Message>(HttpStatus.CREATED);
    }
}
