import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import EnrollButton from "@/components/EnrollButton";
import Image from "next/image";
import TrackSearch from "@/components/TrackSearch";

export const dynamic = "force-dynamic";

async function getTracks(search?: string) {
  const tracks = await prisma.track.findMany({
    where: {
      published: true,
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      _count: {
        select: { modules: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return tracks;
}

export default async function TracksPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const tracks = await getTracks(search);

  //   [
  //     {
  //       id: "cmihvcg4i0001hgob9ho0dx2t",
  //       title: "Frontend Development Mastery",
  //       description:
  //         "Master modern frontend development with React, Next.js, and TypeScript. Build real-world projects and get job-ready.",
  //       published: true,
  //       createdAt: "2025-11-27T20:11:06.018Z",
  //       updatedAt: "2025-11-27T20:11:06.018Z",
  //       _count: {
  //         modules: 2,
  //       },
  //     },
  //     {
  //       id: "cmih9h7bv0002qcvnrmex9fr7",
  //       title: "Data Analytics Roadmap",
  //       description:
  //         "Unlock the skills that power today’s most data-driven teams.\nThe Data Analytics Track is your complete, end-to-end pathway into the world of analytics—designed for absolute beginners and ambitious career-switchers ready to build real expertise.\n\nAcross four practical modules—Microsoft Excel, SQL for Analytics, Power BI, and Looker Studio—you’ll learn how to clean, analyze, visualize, and tell compelling stories with data. Each module stacks on the next, giving you both the technical skills and the confidence to solve real business problems from day one.\n\nBy the end of this track, you’ll be able\n✔️ Make sense of raw datasets using Excel\n✔️ Write clean, efficient SQL queries to answer business questions\n✔️ Build interactive dashboards in Power BI\n✔️ Create sleek, shareable reports using Looker Studio\n✔️ Understand how analysts think, work, and deliver value\n✔️ Translate data into insights that get attention\n\nWhether you’re aiming for your first analyst role or looking to stand out at work, this track gives you the skills (and the bragging rights) to call yourself a Data Analyst with confidence.\n\nLet’s turn “I’m curious about data” into “I’m ready for the job.”",
  //       published: true,
  //       createdAt: "2025-11-27T09:58:54.418Z",
  //       updatedAt: "2025-11-27T10:10:10.963Z",
  //       _count: {
  //         modules: 2,
  //       },
  //     },
  //   ];

  return (
    <main style={{ paddingBottom: "4rem" }}>
      <section
        style={{
          padding: "6rem 0",
          textAlign: "center",
          // background: "linear-gradient(to bottom, var(--primary-light), white)",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "0.5rem 1rem",
            backgroundColor: "rgba(0, 137, 123, 0.1)",
            color: "var(--primary)",
            borderRadius: "99px",
            fontWeight: 600,
            fontSize: "0.9rem",
            marginBottom: "1.5rem",
          }}
        >
          Launching the next generation of African Tech Talent
        </div>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{ fontSize: "3rem", fontWeight: 700, marginBottom: "1rem" }}
          >
            Learning Tracks
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--muted)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Choose a path and start your journey to becoming a world-class
            developer.
          </p>
        </div>

        <div className="container">
          <TrackSearch />
        </div>

        <div className="container">
          <Image
            src="/images/man_holding_binoculars_with_plants.svg"
            alt="man_holding_binoculars_with_plants"
            width={0}
            height={0}
            style={{
              width: "100%",
              height: "auto",
              pointerEvents: "none",
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
            sizes="100vw"
          />
        </div>
      </section>

      <section>
        <div className="container">
          <div
            style={{
              marginBottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "2rem", fontWeight: 700 }}>
              {search ? `Search results for "${search}"` : "Recommended Tracks"}
            </h3>

            {!search && (
              <Link
                href="/tracks"
                className="btn btn-outline"
                style={{
                  padding: "0.75rem 2rem",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                Explore All Tracks
              </Link>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "2rem",
            }}
          >
            {tracks.map((track) => (
              <div
                key={track.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    height: "200px",
                    // backgroundColor: "var(--primary-light)",
                    borderRadius: "var(--radius) var(--radius) 0 0",
                    margin: "-1.5rem -1.5rem 1.5rem -1.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BookOpen size={64} color="var(--primary)" opacity={0.5} />
                </div>

                <h2
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                    height: "4rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {track.title}
                </h2>
                <p
                  style={{
                    color: "var(--muted)",
                    marginBottom: "1.5rem",
                    lineHeight: 1.6,
                    height: "6.4rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {track.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5rem",
                    marginBottom: "1.5rem",
                    fontSize: "0.9rem",
                    color: "var(--muted)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <BookOpen size={16} />
                    <span>{track._count.modules} Modules</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Clock size={16} />
                    <span>Self-paced</span>
                  </div>
                </div>

                <EnrollButton trackId={track.id} />
              </div>
            ))}

            {tracks.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  padding: "4rem",
                  backgroundColor: "var(--muted-light)",
                  borderRadius: "var(--radius)",
                  border: "1px dashed var(--border)",
                }}
              >
                <h3 style={{ marginBottom: "1rem" }}>
                  {search
                    ? `No tracks found matching "${search}"`
                    : "No tracks available yet"}
                </h3>
                <p style={{ color: "var(--muted)" }}>
                  {search
                    ? "Try searching for something else or browse all tracks."
                    : "Check back soon! We are working hard to create amazing content for you."}
                </p>
                {search && (
                  <Link
                    href="/tracks"
                    className="btn btn-primary"
                    style={{ marginTop: "1.5rem" }}
                  >
                    Clear Search
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
