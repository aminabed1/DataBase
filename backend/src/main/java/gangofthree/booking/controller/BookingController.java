package gangofthree.booking.controller;

import gangofthree.booking.dto.response.BookingResponse;
import gangofthree.booking.service.BookingService;
import gangofthree.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ApiResponse<List<BookingResponse>> getUserBookings(
            Authentication authentication,
            @RequestParam(required = false, defaultValue = "ALL") String filter) {
        
        Long userId = (Long) authentication.getPrincipal();
        return bookingService.getUserBookings(userId, filter);
    }
}