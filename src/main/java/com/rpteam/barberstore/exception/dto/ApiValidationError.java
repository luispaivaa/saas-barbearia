package com.rpteam.barberstore.exception.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiValidationError {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private List<FieldError> fieldErrors;

    public static ApiValidationErrorBuilder builder() {
        return new ApiValidationErrorBuilder();
    }

    public static class ApiValidationErrorBuilder {
        private LocalDateTime timestamp;
        private int status;
        private String error;
        private String message;
        private List<FieldError> fieldErrors;

        public ApiValidationErrorBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public ApiValidationErrorBuilder status(int status) {
            this.status = status;
            return this;
        }

        public ApiValidationErrorBuilder error(String error) {
            this.error = error;
            return this;
        }

        public ApiValidationErrorBuilder message(String message) {
            this.message = message;
            return this;
        }

        public ApiValidationErrorBuilder fieldErrors(List<FieldError> fieldErrors) {
            this.fieldErrors = fieldErrors;
            return this;
        }

        public ApiValidationError build() {
            return new ApiValidationError(timestamp, status, error, message, fieldErrors);
        }
    }
}
