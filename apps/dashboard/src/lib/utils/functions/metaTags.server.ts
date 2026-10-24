import type { MetaTagsProps } from 'svelte-meta-tags';
import type { OrgSiteInfo } from '$features/app/layout-setup';
import { BRAND } from '$lib/utils/constants/brand';

export async function getBaseMetaTags(_url: URL, _orgSiteInfo: OrgSiteInfo): Promise<MetaTagsProps> {
  return {
    title: BRAND.product,
    description: 'Cổng đào tạo nội bộ MP Transformation'
  };
}
