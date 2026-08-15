package gangofthree.location.controller;

import gangofthree.common.response.ApiResponse;
import gangofthree.location.dto.LocationDto;
import gangofthree.location.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/provinces")
    public ApiResponse<List<LocationDto>> getProvinces() {
        return ApiResponse.success("Provinces retrieved successfully.", 200, locationService.getProvinces());
    }

    @GetMapping("/cities")
    public ApiResponse<List<LocationDto>> getCities(@RequestParam Long provinceId) {
        return ApiResponse.success("Cities retrieved successfully.", 200, locationService.getCities(provinceId));
    }
}