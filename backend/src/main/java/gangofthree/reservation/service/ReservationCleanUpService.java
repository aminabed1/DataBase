package gangofthree.reservation.service;

import gangofthree.reservation.entity.Reservation;
import gangofthree.reservation.entity.ReservationItem;
import gangofthree.entity.MatchSeat;
import gangofthree.entity.enums.MatchSeatStatus;
import gangofthree.ticket.repository.TicketRepository;
import gangofthree.reservation.entity.enums.ReservationStatus;
import gangofthree.reservation.repository.MatchSeatRepository;
import gangofthree.reservation.repository.ReservationItemRepository;
import gangofthree.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationCleanUpService {
    private final ReservationRepository reservationRepository;
    private final ReservationItemRepository reservationItemRepository;
    private final MatchSeatRepository matchSeatRepository;
    private final TicketRepository ticketRepository;
    @Scheduled(fixedRate = 60000) // هر 60 ثانیه اجرا می‌شود
    @Transactional
    public void cancelExpiredReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> expiredReservations = reservationRepository.findByStatusAndExpiredAtBefore(ReservationStatus.PENDING, now);

        for (Reservation reservation : expiredReservations) {
            reservationRepository.updateReservationStatusNative(reservation.getId(), ReservationStatus.EXPIRED.name());

            List<ReservationItem> items = reservationItemRepository.findByReservationId(reservation.getId());
            for (ReservationItem item : items) {
                MatchSeat seat = item.getMatchSeat();
                matchSeatRepository.updateSeatStatusNative(seat.getId(), MatchSeatStatus.AVAILABLE.name());
                
                String ticketCode = "EXP-" + java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                ticketRepository.insertTicketNative(
                    now, "EXPIRED", gangofthree.ticket.entity.enums.TicketStatus.EXPIRED.name(), ticketCode, item.getId()
                );
            }
            log.info("Expired reservation {} cancelled and seats unlocked.", reservation.getId());
        }
    }
}