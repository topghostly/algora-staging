import { Calendar, Clock } from "lucide-react";

interface Booking {
  id: string;
  tutorSession: {
    title: string;
    startTime: Date;
    endTime: Date;
    tutor: {
      name: string | null;
    };
  };
}

interface BookingHistoryProps {
  bookings: Booking[];
}

export default function BookingHistory({ bookings }: BookingHistoryProps) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-4">
        {/* <CalendarCheck2 size={30} /> */}
        <h3 className="font-medium">Booking History</h3>
      </div>

      {bookings.length === 0 ? (
        <p className="text-muted-foreground">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <h3 className="font-semibold">{booking.tutorSession.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                with {booking.tutorSession.tutor.name}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>
                    {new Date(
                      booking.tutorSession.startTime,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>
                    {new Date(
                      booking.tutorSession.startTime,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
