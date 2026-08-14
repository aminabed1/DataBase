package gangofthree.location.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.entity.City;
import gangofthree.entity.Province;
import gangofthree.location.repository.CityRepository;
import gangofthree.location.repository.ProvinceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final ProvinceRepository provinceRepository;
    private final CityRepository cityRepository;

    @GetMapping("/provinces")
    public ApiResponse<List<Map<String, Object>>> getProvinces() {
        List<Province> provinces = provinceRepository.findAll();
        List<Map<String, Object>> response = provinces.stream()
                .map(p -> Map.of("id", String.valueOf(p.getId()), "name", (Object) p.getName()))
                .collect(Collectors.toList());
        
        return ApiResponse.success("Provinces retrieved successfully.", 200, response);
    }

    @GetMapping("/cities")
    public ApiResponse<List<Map<String, Object>>> getCities(@RequestParam Long provinceId) {
        List<City> cities = cityRepository.findByProvinceId(provinceId);
        List<Map<String, Object>> response = cities.stream()
                .map(c -> Map.of("id", String.valueOf(c.getId()), "name", (Object) c.getName()))
                .collect(Collectors.toList());
        
        return ApiResponse.success("Cities retrieved successfully.", 200, response);
    }
}