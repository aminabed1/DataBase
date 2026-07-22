package gangofthree.common.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public class ApiResponse<T> {
    private T data;
    private String message;
    private boolean success;
    private final Object errors;

    @Builder.Default
    private final LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .data(data)
                .message(message)
                .success(true).build();
    }

    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .message(message)
                .success(true).build();
    }

    public static <T> ApiResponse<T> failure(String message) {
        return ApiResponse.<T>builder()
                .message(message)
                .success(false).build();
    }

    public static <T> ApiResponse<T> failure(String message, Object errors) {
        return ApiResponse.<T>builder()
                .message(message)
                .success(false)
                .errors(errors)
                .build();
    }
}
