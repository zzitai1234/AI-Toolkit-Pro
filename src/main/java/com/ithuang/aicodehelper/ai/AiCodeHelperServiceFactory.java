package com.ithuang.aicodehelper.ai;

import com.ithuang.aicodehelper.ai.tools.InterviewQuestionTool;
// import dev.langchain4j.mcp.McpToolProvider; // 临时禁用MCP
import dev.langchain4j.mcp.McpToolProvider;
import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiCodeHelperServiceFactory {

    @Resource
    private ChatModel myQwenChatModel;

    @Resource
    private ContentRetriever contentRetriever;

     @Resource
     private McpToolProvider mcpToolProvider;

    @Resource
    private StreamingChatModel qwenStreamingChatModel;


    @Bean
    public AiCodeHelperService aiCodeHelperService(){
        // 会话记忆
        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
        // 构造AI Service
        AiCodeHelperService aiCodeHelperService = AiServices.builder(AiCodeHelperService.class)
                .chatModel(myQwenChatModel)
                .streamingChatModel(qwenStreamingChatModel)//流式模型
                .chatMemory(chatMemory)//会话记忆
                .chatMemoryProvider(memoryId ->
                        MessageWindowChatMemory.withMaxMessages(10)) // 每个会话独立存储
                .contentRetriever(contentRetriever)//RAG 检索增强生成
                .tools(new InterviewQuestionTool())// 工具调用
                 .toolProvider(mcpToolProvider) // MCP 工具调用 - 临时禁用
                .build();
        return aiCodeHelperService;

    }

}
