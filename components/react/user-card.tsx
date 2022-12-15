import React from 'react';
import { Text, Stack, Box } from '@chakra-ui/react';
import { ConnectedUserCardType } from '../types';

export const ConnectedUserInfo = ({
  username
}: ConnectedUserCardType) => {
  return (
    <Stack spacing={1} alignItems="center">
      {username && (
        <>
          <Text fontSize={{ md: 'xl' }} fontWeight="semibold">
            {username}
          </Text>
        </>
      )}
    </Stack>
  );
};
