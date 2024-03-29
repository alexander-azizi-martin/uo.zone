import { type GetStaticPropsContext } from 'next';
import { withAxiomGetServerSideProps } from 'next-axiom';

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

export const getServerSideProps = withAxiomGetServerSideProps(
  async (context) => {
    return {
      props: {
        messages: await getDictionary(context.locale),
      },
    };
  }
);
