import { Stack } from '@chakra-ui/react';
import type { NextPage, NextPageContext } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';

const Home: NextPage = ({ session }) => {
  console.log(session);
  return (
    <>
      <Stack>
        <button onClick={() => signIn('google')}>Sign In</button>
        <button onClick={() => signOut()}>Sign Out</button>
      </Stack>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

export default Home;
