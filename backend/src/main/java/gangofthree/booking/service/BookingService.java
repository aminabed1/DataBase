package gangofthree.booking.service;

import gangofthree.booking.dto.response.BookingResponse;
import gangofthree.common.response.ApiResponse;
import java.util.List;

public interface BookingService {
    ApiResponse<List<BookingResponse>> getUserBookings(Long userId, String filter);
}