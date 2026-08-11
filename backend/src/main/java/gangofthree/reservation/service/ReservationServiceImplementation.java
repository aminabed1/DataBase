package gangofthree.reservation.service;

import gangofthree.common.response.ApiResponse;
import gangofthree.entity.MatchSeat;
import gangofthree.reservation.entity.Reservation;
import gangofthree.reservation.entity.ReservationItem;
import gangofthree.entity.enums.MatchSeatStatus;
import gangofthree.reservation.entity.enums.ReservationStatus;
import gangofthree.reservation.dto.request.ReserveTicketRequest;
import gangofthree.reservation.dto.response.ReservationResponse;
import gangofthree.reservation.repository.MatchSeatRepository;
import gangofthree.reservation.repository.ReservationItemRepository;
import gangofthree.reservation.repository.ReservationRepository;
import gangofthree.user.entity.User;
import gangofthree.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImplementation implements ReservationService {

    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationItemRepository reservationItemRepository;
    private final MatchSeatRepository matchSeatRepository;

    @Override
    @Transactional
    public ApiResponse<ReservationResponse> createReservation(Long userId, ReserveTicketRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MatchSeat> seats = matchSeatRepository.findAllById(request.getMatchSeatIds());

        if (seats.isEmpty() || seats.size() != request.getMatchSeatIds().size()) {
            return ApiResponse.failure("Invalid seat selection.", 400, "INVALID_SEATS");
        }

        boolean allAvailable = seats.stream().allMatch(seat -> seat.getStatus() == MatchSeatStatus.AVAILABLE);
        if (!allAvailable) {
            return ApiResponse.failure("One or more selected seats are not available.", 400, "SEAT_UNAVAILABLE");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setReservedAt(LocalDateTime.now());
        reservation.setExpiredAt(LocalDateTime.now().plusMinutes(10));
        reservation.setStatus(ReservationStatus.PENDING);
        reservation = reservationRepository.save(reservation);

        for (MatchSeat seat : seats) {
            seat.setStatus(MatchSeatStatus.RESERVED);
            matchSeatRepository.save(seat);

            ReservationItem item = new ReservationItem();
            item.setReservation(reservation);
            item.setMatchSeat(seat);
            item.setPriceAtTime(seat.getPrice());
            reservationItemRepository.save(item);

            totalAmount = totalAmount.add(seat.getPrice());
        }

        ReservationResponse response = ReservationResponse.builder()
                .reservationId(reservation.getId())
                .reservedAt(reservation.getReservedAt())
                .expiredAt(reservation.getExpiredAt())
                .status(reservation.getStatus())
                .totalAmount(totalAmount)
                .build();

        return ApiResponse.success("Reservation created successfully. You have 10 minutes to pay.", 200, response);
    }

    @Override
    public ApiResponse<List<ReservationResponse>> getActiveReservations(Long userId) {
        List<Reservation> activeReservations = reservationRepository.findByUserIdAndStatus(userId, ReservationStatus.PENDING);
        
        List<ReservationResponse> responses = activeReservations.stream().map(res -> {
            List<ReservationItem> items = reservationItemRepository.findByReservationId(res.getId());
            BigDecimal totalAmount = items.stream()
                    .map(ReservationItem::getPriceAtTime)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            return ReservationResponse.builder()
                    .reservationId(res.getId())
                    .reservedAt(res.getReservedAt())
                    .expiredAt(res.getExpiredAt())
                    .status(res.getStatus())
                    .totalAmount(totalAmount)
                    .build();
        }).toList();

        return ApiResponse.success("Active reservations retrieved.", 200, responses);
    }

    @Override
    public ApiResponse<List<ReservationResponse>> getReservationHistory(Long userId) {
        List<Reservation> history = reservationRepository.findByUserIdOrderByReservedAtDesc(userId);
        
        List<ReservationResponse> responses = history.stream().map(res -> {
            List<ReservationItem> items = reservationItemRepository.findByReservationId(res.getId());
            BigDecimal totalAmount = items.stream()
                    .map(ReservationItem::getPriceAtTime)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            return ReservationResponse.builder()
                    .reservationId(res.getId())
                    .reservedAt(res.getReservedAt())
                    .expiredAt(res.getExpiredAt())
                    .status(res.getStatus())
                    .totalAmount(totalAmount)
                    .build();
        }).toList();

        return ApiResponse.success("Reservation history retrieved.", 200, responses);
    }
}