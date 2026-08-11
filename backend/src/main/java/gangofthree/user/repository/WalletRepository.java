package gangofthree.user.repository;

import gangofthree.user.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.math.BigDecimal;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByUserId(Long userId);

    @Modifying
    @Query(value = "UPDATE wallets SET credit = :credit WHERE id = :id", nativeQuery = true)
    void updateWalletCreditNative(@Param("id") Long id, @Param("credit") BigDecimal credit);
}