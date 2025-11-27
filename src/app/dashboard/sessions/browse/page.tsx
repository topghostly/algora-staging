import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { bookSession } from "@/app/actions/booking";
import { Calendar, Clock, User } from "lucide-react";

async function getAvailableSessions(userId: string) {
    const sessions = await prisma.session.findMany({
        where: {
            startTime: {
                gt: new Date()
            }
        },
        include: {
            tutor: {
                select: { name: true }
            },
            bookings: {
                select: { userId: true }
            }
        },
        orderBy: {
            startTime: 'asc'
        }
    });

    // Filter out sessions where:
    // 1. User already booked
    // 2. 1-on-1 is full
    return sessions.filter(session => {
        const isBookedByUser = session.bookings.some(b => b.userId === userId);
        const isFull = session.type === 'ONE_ON_ONE' && session.bookings.length >= 1;
        return !isBookedByUser && !isFull;
    });
}

export default async function BrowseSessionsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/auth/signin");
    }

    const availableSessions = await getAvailableSessions(session.user.id);

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Available Sessions</h1>

            {availableSessions.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No available sessions at the moment. Check back later!</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {availableSessions.map((s) => (
                        <div key={s.id} className="card p-6 flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    {s.tutor.name?.[0] || "T"}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{s.title}</h3>
                                    <p className="text-sm text-muted-foreground">{s.tutor.name}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 flex-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar size={16} />
                                    <span>{new Date(s.startTime).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock size={16} />
                                    <span>
                                        {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                        {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <User size={16} className="text-muted-foreground" />
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${s.type === 'ONE_ON_ONE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        {s.type.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <form action={bookSession.bind(null, s.id)}>
                                <button type="submit" className="btn btn-primary w-full">
                                    Book Session
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
