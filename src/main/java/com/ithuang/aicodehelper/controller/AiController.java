package com.ithuang.aicodehelper.controller;


import com.ithuang.aicodehelper.ai.AiCodeHelperService;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/ai")
@Slf4j
public class AiController {

    @Resource
    private AiCodeHelperService aiCodeHelperService;

    @GetMapping(value = "/chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> chat(@RequestParam String memoryId, @RequestParam String message){
        log.info("收到聊天请求: memoryId={}, message={}", memoryId, message);
        
        try {
            return aiCodeHelperService.chatStream(memoryId, message)
                    .map(chunk -> {
                        log.debug("发送SSE数据块: {}", chunk);
                        return ServerSentEvent.<String>builder()
                                .data(chunk)
                                .build();
                    })
                    .doOnComplete(() -> log.info("SSE流完成"))
                    .doOnError(error -> log.error("SSE流错误: ", error));
        } catch (Exception e) {
            log.error("处理聊天请求时发生错误: ", e);
            return Flux.just(ServerSentEvent.<String>builder()
                    .data("抱歉，处理您的请求时发生错误，请稍后重试。")
                    .build());
        }
    }

}
