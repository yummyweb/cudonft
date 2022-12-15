import Head from 'next/head';
import {
  Box,
  Divider,
  Heading,
  Text,
  Stack,
  Container,
  Link,
  Button,
  VStack,
  Flex,
  Grid,
  GridItem,
  Icon,
  Image,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs';
import { Product, Dependency, Error, WalletSection, ConnectedShowAddress, CopyAddressBtn, Connected, ConnectStatusWarn, RejectedWarn, WalletConnectComponent, Disconnected, Connecting, Rejected, NotExist } from '../components';
import { useWallet } from '@cosmos-kit/react';
import { MouseEventHandler, useEffect, useState } from 'react';
import axios from 'axios';
import { IoAdd } from 'react-icons/io5';
import CreateNFT from '../components/create-nft';
import MintNFT from '../components/mint-nft';

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isMintOpen, onOpen: onMintOpen, onClose: onMintClose } = useDisclosure()
  const [nfts, setNFTs] = useState<any[]>([])
  const walletManager = useWallet();
  const {
    connect,
    openView,
    walletStatus,
    username,
    address,
    message,
    currentChainName,
    currentWallet,
    currentChainRecord,
    getChainLogo,
    setCurrentChain,
  } = walletManager;

  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  useEffect(() => {
    if (address && nfts.length === 0) {
      const res = axios.post("https://sentry1.gcp-uscentral1.cudos.org:31317/nft/owners", {
        owner_address: address,
        denom_id: "cbdp"
      })
      res.then(data => {
        for (let i = 0; i < data.data.result.owner.id_collections[0].token_ids.length; i++) {
          axios.get("https://sentry1.gcp-uscentral1.cudos.org:31317/nft/nfts/cbdp/" + data.data.result.owner.id_collections[0].token_ids[i])
            .then(token => {
              setNFTs(prev => [...prev, {
                name: token.data.result.nft.name,
                img: token.data.result.nft.uri,
              }])
            })
        }
      })
    }
  }, [address])
  return (
    <Container maxW="5xl" py={10}>
      <Head>
        <title>Cudos NFT Interface</title>
        <meta name="description" content="An interface for the Cudos native NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex justifyContent={"space-between"} mb={4}>
        <Button variant="outline" px={0} onClick={toggleColorMode}>
          <Icon
            as={colorMode === 'light' ? BsFillMoonStarsFill : BsFillSunFill}
          />
        </Button>
        <Flex w="50%" alignItems={"center"}>
          <Text mr={5}>{address?.substring(0, 10)}...{address?.substring(37)}</Text>
          <WalletConnectComponent
            walletStatus={walletStatus}
            disconnect={
              <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
            }
            connecting={<Connecting />}
            connected={
              <Connected buttonText={'My Wallet'} onClick={onClickOpenView} />
            }
            rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
            error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
            notExist={
              <NotExist buttonText="Install Wallet" onClick={onClickOpenView} />
            }
          />
          <Button
            ml={5}
            w="full"
            minW="fit-content"
            size="lg"
            bgImage="linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)"
            color="white"
            opacity={1}
            transition="all .5s ease-in-out"
            _hover={{
              bgImage:
                'linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)',
              opacity: 0.75
            }}
            _active={{
              bgImage:
                'linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)',
              opacity: 0.9
            }}
            onClick={onOpen}
          >
            <Icon as={IoAdd} mr={2} />
            Issue Denom
          </Button>
          <Button
            ml={5}
            w="full"
            minW="fit-content"
            size="lg"
            bgImage="linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)"
            color="white"
            opacity={1}
            transition="all .5s ease-in-out"
            _hover={{
              bgImage:
                'linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)',
              opacity: 0.75
            }}
            _active={{
              bgImage:
                'linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)',
              opacity: 0.9
            }}
            onClick={onMintOpen}
          >
            <Icon as={IoAdd} mr={2} />
            Mint NFT
          </Button>
        </Flex>
      </Flex>
      <Box textAlign="center">
        <Heading
          as="h1"
          fontSize={{ base: '3xl', sm: '4xl', md: '5xl' }}
          fontWeight="extrabold"
          mb={3}
        >
          Cudos NFT Interface
        </Heading>
      </Box>
      <WalletSection />
      <Heading as="h1" mb={5} fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}>Your NFTs</Heading>
      <Grid mb={10} templateColumns='repeat(3, 1fr)' gap={6}>
        {nfts.map((nft: any) => (
          <GridItem w='300px' h='300px' bg='blue.500' borderRadius={"2xl"}>
            <Image width="100%" height="100%" src={nft.img} borderRadius={"2xl"} />
          </GridItem>)
        )}
      </Grid>
      <Box mb={3}>
        <Divider />
      </Box>
      <Stack
        isInline={true}
        spacing={1}
        justifyContent="center"
        opacity={0.5}
        fontSize="sm"
      >
        <Text>Built with 💙 by Cudos</Text>
      </Stack>
      <CreateNFT walletManager={walletManager} isOpen={isOpen} onClose={onClose} />
      <MintNFT walletManager={walletManager} isOpen={isMintOpen} onClose={onMintClose} />
    </Container>
  );
}
