package gangofthree.admin.repository;

import gangofthree.entity.IssueReport;
import gangofthree.entity.enums.IssueReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueReportRepository extends JpaRepository<IssueReport, Long> {
    
    List<IssueReport> findByStatus(IssueReportStatus status);
    
    List<IssueReport> findByUserId(Long userId);
}