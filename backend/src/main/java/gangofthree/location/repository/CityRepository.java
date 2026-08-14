package gangofthree.location.repository;

import gangofthree.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByProvinceId(Long provinceId);
}