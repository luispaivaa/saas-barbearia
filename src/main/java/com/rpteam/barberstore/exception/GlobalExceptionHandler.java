package com.rpteam.barberstore.exception;

import com.rpteam.barberstore.exception.dto.ApiError;
import com.rpteam.barberstore.exception.dto.ApiValidationError;
import com.rpteam.barberstore.exception.dto.FieldError;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Trata RegraNegocioException (violação de regras de negócio).
     * Retorna HTTP 400 Bad Request.
     */
    @ExceptionHandler(RegraNegocioException.class)
    public ResponseEntity<ApiError> handleRegraNegocioException(
            RegraNegocioException ex, WebRequest request) {

        ApiError apiError = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Erro de Regra de Negócio")
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Trata MethodArgumentNotValidException (erros de validação do @Valid).
     * Retorna HTTP 400 com lista detalhada de erros por campo.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiValidationError> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException ex, WebRequest request) {

        List<FieldError> fieldErrors = new ArrayList<>();

        ex.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.add(new FieldError(
                        error.getField(),
                        error.getDefaultMessage(),
                        error.getRejectedValue() != null ? error.getRejectedValue().toString() : null
                ))
        );

        ApiValidationError apiError = ApiValidationError.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Erro de Validação")
                .message("Validação dos dados de entrada falhou")
                .fieldErrors(fieldErrors)
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.BAD_REQUEST);
    }

    /**
     * Trata EntityNotFoundException (recurso não encontrado).
     * Retorna HTTP 404 Not Found.
     */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiError> handleEntityNotFoundException(
            EntityNotFoundException ex, WebRequest request) {

        ApiError apiError = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.NOT_FOUND.value())
                .error("Recurso Não Encontrado")
                .message(ex.getMessage())
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.NOT_FOUND);
    }

    /**
     * Trata exceções genéricas não previstas.
     * Retorna HTTP 500 Internal Server Error.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGlobalException(
            Exception ex, WebRequest request) {

        ApiError apiError = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("Erro Interno do Servidor")
                .message("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.")
                .build();

        return new ResponseEntity<>(apiError, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

