/**
 * MDX Custom Components for Blog Posts
 *
 * These components can be used directly in MDX files:
 *
 * ```mdx
 * import { Callout, CodeBlock, KeyStat } from '@/components/mdx'
 *
 * <Callout type="warning">
 *   Atenção: Este procedimento requer autorização judicial.
 * </Callout>
 * ```
 */

// Content Components
export { default as Callout } from "./Callout";
export { default as CodeBlock } from "./CodeBlock";
export { default as KeyStat } from "./KeyStat";
export { default as ImageGallery } from "./ImageGallery";
export { default as FileLocation } from "./FileLocation";
export { default as Timeline } from "./Timeline";
export { default as ComparisonTable } from "./ComparisonTable";
export { default as VideoEmbed } from "./VideoEmbed";
export { default as DownloadCard } from "./DownloadCard";
export { default as Quiz } from "./Quiz";

// Monetization/Lead Gen Components
export { default as LeadCaptureCard } from "./LeadCaptureCard";
export { default as CTABanner } from "./CTABanner";

// Series Components
export { default as SeriesNavigation } from "./SeriesNavigation";
export { default as SeriesCard } from "./SeriesCard";
