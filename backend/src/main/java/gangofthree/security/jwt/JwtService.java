package gangofthree.security.jwt;

import gangofthree.security.jwt.model.TokenType;
import gangofthree.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-expiration}")
    private Duration accessTokenExpiration;

    @Value("${jwt.reset-expiration}")
    private Duration resetTokenExpiration;

    @Value("${jwt.register-expiration}")
    private Duration registerTokenExpiration;

    public String generateAccessToken(User user) {
        return buildToken(
                String.valueOf(user.getId()),
                Map.of(
                        "type", TokenType.ACCESS.name(),
                        "email", user.getEmail(),
                        "phoneNumber", user.getPhoneNumber(),
                        "role", user.getRole().name()
                ),
                accessTokenExpiration
        );
    }

    public String generateResetToken(User user) {
        return buildToken(
                String.valueOf(user.getId()),
                Map.of(
                        "type", TokenType.PASSWORD_RESET.name()
                ),
                resetTokenExpiration
        );
    }

    public String generateRegisterToken(User user) {
        return buildToken(
                String.valueOf(user.getId()),
                Map.of(
                        "type", TokenType.REGISTER_VERIFICATION.name()
                ),
                registerTokenExpiration
        );
    }

    public String extractUserId(String token) {
        return extractAllClaims(token)
                .getSubject();
    }

    public String extractTokenType(String token) {
        return extractAllClaims(token)
                .get("type", String.class);
    }

    public String extractEmail(String token) {
        return extractAllClaims(token)
                .get("email", String.class);
    }

    public String extractRole(String token) {
        return extractAllClaims(token)
                .get("role", String.class);
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    public boolean isAccessTokenValid(String token, User user) {
        return isTokenValid(token, user, TokenType.ACCESS);
    }

    public boolean isPasswordResetTokenValid(String token, User user) {
        return isTokenValid(token, user, TokenType.PASSWORD_RESET);
    }

    public boolean isRegisterVerificationTokenValid(String token, User user) {
        return isTokenValid(token, user, TokenType.REGISTER_VERIFICATION);
    }


    private boolean isTokenValid(String token, User user, TokenType expectedType) {
        String userId = extractUserId(token);
        String tokenType = extractTokenType(token);

        return userId.equals(String.valueOf(user.getId()))
                && tokenType.equals(expectedType.name())
                && !isTokenExpired(token);
    }

    public boolean isTokenStructurallyValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private String buildToken(String subject, Map<String, Object> claims, Duration expiration) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expiration.toMillis());

        return Jwts.builder()
                .subject(subject)
                .claims(claims)
                .issuedAt(now)
                .expiration(expirationDate)
                .signWith(getSigningKey())
                .compact();
    }
}