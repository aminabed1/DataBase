package gangofthree.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private T data;
    private String message;
    private Integer status;
    private String errorCode;
    private boolean success;
    private Object errors;
    private String path;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .data(data)
                .message(message)
                .success(true)
                .build();
    }

    public static <T> ApiResponse<T> success(String message) {
        return ApiResponse.<T>builder()
                .message(message)
                .success(true)
                .build();
    }

    public static <T> ApiResponse<T> failure(String message) {
        return ApiResponse.<T>builder()
                .message(message)
                .success(false)
                .build();
    }

    public static <T> ApiResponse<T> failure(String message, Integer status) {
        return ApiResponse.<T>builder()
                .message(message)
                .status(status)
                .success(false)
                .build();
    }

    public static <T> ApiResponse<T> failure(String message, int status, String errorCode) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .status(status)
                .errorCode(errorCode)
                .build();
    }

    public static <T> ApiResponse<T> failure(String message, int status, String errorCode, Object errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .status(status)
                .errorCode(errorCode)
                .errors(errors)
                .build();
    }

    public static <T> ApiResponse<T> failure(String message, Object errors) {
        return ApiResponse.<T>builder()
                .message(message)
                .success(false)
                .errors(errors)
                .build();
    }

    public static <T> ApiResponse<T> failure(String message,T data, Object errors) {
        return ApiResponse.<T>builder()
                .data(data)
                .message(message)
                .success(false)
                .errors(errors)
                .build();
    }

    public static <T> ApiResponse<T> failure(
            String message,
            int status,
            String errorCode,
            Object errors,
            String path
    ) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .status(status)
                .errorCode(errorCode)
                .errors(errors)
                .path(path)
                .build();
    }
}
