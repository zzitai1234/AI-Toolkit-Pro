package com.ithuang.aicodehelper.ai;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class AiCodeHelperServiceTest {

    @Resource
    private AiCodeHelperService aiCodeHelperService;


    @Test
    void chat() {
        String result = aiCodeHelperService.chat("你好，我是小璐");
        System.out.println(result);
        result = aiCodeHelperService.chat("我是谁");
        System.out.println(result);
    }

    @Test
    void chatForReport() {
        String userMessage = "你好，我是程序员小璐，学习编程两年半，请帮我制定学习报告";
        AiCodeHelperService.Report report = aiCodeHelperService.chatForReport(userMessage);
        System.out.println(report);
    }
    @Test
    void chatWithRag() {
        String result = aiCodeHelperService.chat("怎么学习Java？有哪些面试题？");
        System.out.println(result);
    }
    @Test
    void chatWithMcp() {
        String result = aiCodeHelperService.chat("什么是程序员黑马的编程导航？");
        System.out.println(result);
    }

}