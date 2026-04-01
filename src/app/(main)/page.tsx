import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { Win2kDesktop } from "@/components/Win2kDesktop";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Win2kDesktop />
      <Footer />
    </>
  );
}
