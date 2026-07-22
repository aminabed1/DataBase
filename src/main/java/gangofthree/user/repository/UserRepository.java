package gangofthree.user.repository;

import gangofthree.auth.dto.request.RegisterRequest;
import gangofthree.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhoneNumberAndPasswordHash(String phoneNumber, String passwordHash);
    Boolean existsByPhoneNumber(String phoneNumber);
}
