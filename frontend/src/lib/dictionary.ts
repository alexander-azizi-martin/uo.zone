import type { GetStaticPropsContext } from 'next';

export async function getDictionary(context: GetStaticPropsContext) {
  return {
    props: {
      messages: (await import(`../dictionaries/${context.locale}.json`)).default,
    },
  };
}
