import type { GetStaticPropsContext } from 'next';

export async function getDictionary(locale: string = 'en') {
  return (await import(`../dictionaries/${locale}.json`)).default;
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      messages: await getDictionary(context.locale),
    },
  };
}
