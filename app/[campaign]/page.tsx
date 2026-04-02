// // app/[campaign]/page.tsx
// import { redirect } from "next/navigation";

// export default async function CampaignRedirectPage({
//   params,
// }: {
//   params: Promise<{ campaign: string }>;
// }) {
//   const { campaign } = await params;

//   // Exclude specific routes that should not be treated as campaigns
//   const excludedCampaigns = [
//     'gallery',
//     'about-us',
//     'contact',
    
//     'blog',
//     'events',
//     'volunteer',
//     'governance',
//     'policies',
//     'terms-conditions',
//     'trust',
//     'refund',
//     'certificates',
//     'our-initiative',
//     'home',
//     'donate-to-cause',
//     'build-school',
//     'campaign-page',
//     'grocery-donation',
//     'donation-kit'

//   ];

//   // If this is an excluded route, don't redirect
//   if (excludedCampaigns.includes(campaign)) {
//     return null;
//   }

//   redirect(`/?utm_source=AIKYA&utm_medium=SMS&utm_campaign=${campaign}`);

//   // Returning null satisfies React.FC typing
//   return null;
// }
import { redirect } from "next/navigation";

export default async function CampaignRedirectPage({
  params,
}: {
  params: Promise<{ campaign: string }>;
}) {
  const { campaign } = await params;

  // Routes that should NOT redirect
  const excludedCampaigns = [
    "gallery",
    "about-us",
    "contact",
    "blog",
    "events",
    "volunteer",
    "governance",
    "policies",
    "terms-conditions",
    "trust",
    "refund",
    "certificates",
    "our-initiative",
    "home",
    "donate-to-cause",
    "campaign-page",
    "grocery-donation",
    "donation-kit",
    "build-school",
    "video-gallery",
    "donor-wall",
    "photo-gallery",
    "sponsorships"

  ];

  // If this is an excluded route, do nothing
  if (excludedCampaigns.includes(campaign)) {
    return null;
  }

  // Otherwise redirect
  redirect(`/?utm_source=AIKYA&utm_medium=SMS&utm_campaign=${campaign}`);
}
