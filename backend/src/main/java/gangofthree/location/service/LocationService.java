package gangofthree.location.service;

import gangofthree.location.dto.LocationDto;
import gangofthree.location.repository.CityRepository;
import gangofthree.location.repository.ProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final ProvinceRepository provinceRepository;
    private final CityRepository cityRepository;

    public List<LocationDto> getProvinces() {
        return provinceRepository.findAll().stream()
                .map(p -> new LocationDto(String.valueOf(p.getId()), p.getName()))
                .collect(Collectors.toList());
    }

    public List<LocationDto> getCities(Long provinceId) {
        return cityRepository.findByProvinceId(provinceId).stream()
                .map(c -> new LocationDto(String.valueOf(c.getId()), c.getName()))
                .collect(Collectors.toList());
    }
}
