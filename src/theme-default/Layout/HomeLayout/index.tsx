import { usePageData } from 'runtime';
import { HomeHero } from '../../components/HomeHero';
import { HomeFeature } from '../../components/HomeFeatrue';

export default function HomeLayout() {
  const { frontmatter } = usePageData();
  console.log('home页面元信息：', frontmatter);
  return (
    <div>
      <HomeHero hero={frontmatter.hero} />
      <HomeFeature features={frontmatter.features} />
    </div>
  );
}
