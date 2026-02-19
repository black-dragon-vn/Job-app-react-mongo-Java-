package com.jobportal.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtHelper {

    private static final String SECRET = "your-super-secret-key-that-should-be-very-long-256bit";
    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        CustomUserDetails customUser = (CustomUserDetails) userDetails;

        Long userId = customUser.getProfileId();

        claims.put("email", customUser.getUsername());
        claims.put("id", customUser.getUsername());
        claims.put("userId", userId);
        claims.put("profileId", customUser.getUsername());
        claims.put("name", customUser.getName());
        claims.put("accountType", customUser.getAccountType());

        System.out.println("=== JWT Generation ===");
        System.out.println("Email: " + customUser.getUsername());
        System.out.println("UserId: " + userId);
        System.out.println("Name: " + customUser.getName());
        System.out.println("AccountType: " + customUser.getAccountType());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(customUser.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}