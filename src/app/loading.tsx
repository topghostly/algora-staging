import GlobalLoader from "@/components/GlobalLoader";

export default function Loading() {
  // In Next.js App Router, loading.tsx automatically shows up during 
  // server component transitions and data fetching. It exits once the 
  // destination route resolves its data.
  return <GlobalLoader />;
}
