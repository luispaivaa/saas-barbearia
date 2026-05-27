package com.rpteam.barberstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.rpteam.barberstore.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = 
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Cliente endpoints
                .requestMatchers(HttpMethod.GET, "/api/clientes/{id}").hasAnyAuthority("CLIENTE", "BARBEIRO")
                .requestMatchers(HttpMethod.PUT, "/api/clientes/{id}").hasAuthority("CLIENTE")
                .requestMatchers(HttpMethod.POST, "/api/clientes").permitAll() // Novo cadastro
                
                // Barbeiro endpoints - ADMIN only
                .requestMatchers(HttpMethod.GET, "/api/barbeiros").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/barbeiros/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/barbeiros").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/barbeiros/{id}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/barbeiros/{id}").hasAuthority("ADMIN")
                
                // Serviço endpoints - ADMIN only
                .requestMatchers(HttpMethod.GET, "/api/servicos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/servicos/{id}").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/servicos").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/servicos/{id}").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/servicos/{id}").hasAuthority("ADMIN")
                
                // Agendamento endpoints
                .requestMatchers(HttpMethod.POST, "/api/agendamentos").hasAnyAuthority("CLIENTE", "BARBEIRO")
                .requestMatchers(HttpMethod.GET, "/api/agendamentos/cliente/**").hasAuthority("CLIENTE")
                .requestMatchers(HttpMethod.GET, "/api/agendamentos/barbeiro/**").hasAnyAuthority("BARBEIRO", "CLIENTE")
                .requestMatchers(HttpMethod.DELETE, "/api/agendamentos/{id}").hasAuthority("BARBEIRO")
                
                // Disponibilidade endpoints
                .requestMatchers(HttpMethod.POST, "/api/disponibilidades").hasAuthority("BARBEIRO")
                .requestMatchers(HttpMethod.GET, "/api/disponibilidades/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/disponibilidades/{id}").hasAuthority("BARBEIRO")
                .requestMatchers(HttpMethod.DELETE, "/api/disponibilidades/{id}").hasAuthority("BARBEIRO")
                
                // Qualquer outra request requer autenticação
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())); // H2 console

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173", "http://localhost:8080"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
