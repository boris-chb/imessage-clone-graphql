import { useMutation } from '@apollo/client';
import { Button, Center, Image, Input, Stack, Text } from '@chakra-ui/react';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import UserOperations from 'src/graphql/operations/user';
import { CreateUsernameData, CreateUsernameVariables } from 'src/util/types';

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

  const [createUsername, { loading, error }] = useMutation<
    CreateUsernameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername);

  const onSubmit = async () => {
    // GraphQL Mutation to Create Username
    if (!username) return;

    try {
      const { data } = await createUsername({
        variables: {
          username,
        },
      });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;

        toast.error(error);
      }

      toast.success('Username successfully created');

      // Reload session to fetch updated user
      reloadSession();
    } catch (error: any) {
      toast.error('There was an error!');
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
            <Button width={'100%'} onClick={onSubmit} isLoading={loading}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Text fontSize={'4xl'}>iMessage GraphQL</Text>
            <Text width={'70%'} align="center">
              Sign in with Google to connect with your friends
            </Text>
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
