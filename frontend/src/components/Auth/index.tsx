import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface AuthProps {
  session: Session | null;
  // Refetches the session and user from db after username creation
  reloadSession: () => void;
}

const Auth: React.FunctionComponent<AuthProps> = ({
  session,
  reloadSession,
}) => {
  const [username, setUsername] = useState('');

  const onSubmit = async () => {
    // GraphQL Mutation to Create Username
    try {
    } catch (error) {
      console.error('onSubmit error', error);
    }
  };

  return (
    <Center height="100vh" border="1px solid red">
      <Stack spacing={7} align="center">
        {session ? (
          <>
            <Text>Create Username</Text>
            <Input
              placeholder="Enter a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button width={'100%'} onClick={onSubmit}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize={'3xl'}>iMessage GraphQL</Text>
            <Button
              onClick={() => signIn('google')}
              leftIcon={
                <Image
                  height="20px"
                  src="/images/google-logo.png"
                  alt="Google Logo Icon"
                />
              }
            >
              Continue with Google
            </Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
