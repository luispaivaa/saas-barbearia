package com.rpteam.barberstore.exception.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiError {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;

    public static ApiErrorBuilder builder() {
        return new ApiErrorBuilder();
    }

    public static class ApiErrorBuilder {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;

        public ApiErrorBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public ApiErrorBuilder status(int status) {
            this.status = status;
            return this;
        }

        public ApiErrorBuilder error(String error) {
            this.error = error;
            return this;
        }

        public ApiErrorBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ApiError build() {
            return new ApiError(timestamp, status, error, message);
        }
    }
}
