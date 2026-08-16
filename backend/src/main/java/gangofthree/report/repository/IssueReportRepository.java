package gangofthree.report.repository;

import gangofthree.report.entity.enums.IssueReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import gangofthree.report.entity.IssueReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.List;

@Repository
public interface IssueReportRepository extends JpaRepository<IssueReport, Long> {
    
    List<IssueReport> findByStatus(IssueReportStatus status);
    
    List<IssueReport> findByUserId(Long userId);
    @Query(value = "SELECT i.id, i.subject, i.description, i.status, i.reply, i.created_at, u.name as user_name, u.email as user_email, i.reservation_id " +
                   "FROM issue_reports i JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC", nativeQuery = true)
    List<Map<String, Object>> findAllIssuesWithUserDetailsNative();

    // ثبت پاسخ ساپورت و تغییر وضعیت به RESOLVED
    @Modifying
    @Transactional
    @Query(value = "UPDATE issue_reports SET status = 'RESOLVED', reply = :reply WHERE id = :id", nativeQuery = true)
    void replyToIssueNative(@Param("id") Long id, @Param("reply") String reply);
}