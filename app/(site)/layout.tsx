import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { AnnouncementBar } from "@/components/site/announcement-bar";
import { CampaignBanner } from "@/components/site/campaign-banner";
import { FloatingSocials } from "@/components/site/floating-socials";
import { StoreProvider } from "@/components/store/store";
import { getSettings } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();
  return (
    <StoreProvider whatsappNumber={s.whatsappNumber}>
      <div
        className="pointer-events-none fixed inset-0 z-[1] bg-noise opacity-[0.04] mix-blend-soft-light"
        aria-hidden
      />
      <CampaignBanner text={s.campaignText} />
      <AnnouncementBar />
      <Navbar whatsappNumber={s.whatsappNumber} />
      <main className="flex-1">{children}</main>
      <Footer
        whatsappNumber={s.whatsappNumber}
        instagramUrl={s.instagramUrl}
        tiktokUrl={s.tiktokUrl}
      />
      <FloatingSocials
        whatsappNumber={s.whatsappNumber}
        instagramUrl={s.instagramUrl}
        tiktokUrl={s.tiktokUrl}
      />
    </StoreProvider>
  );
}
