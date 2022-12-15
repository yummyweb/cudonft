import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/react'
import { WalletManager } from '@cosmos-kit/core';
import { chains } from 'chain-registry';
import { useToast } from '@chakra-ui/react'
import { GasPrice, generateMsg, SigningCosmWasmClient, SigningStargateClient } from 'cudosjs';

import { Field, Form, Formik } from 'formik';
import { chainName } from '../config';
import { useEffect } from 'react';
import { NFTStorage } from 'nft.storage'

const nftStorageClient = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVBYzA0MzUxMDQ5RDBhYTgxQUZjMDc2MTlCZjJFQzFhNjczMDVGMDUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MTA4MDY5OTM2OCwibmFtZSI6ImN1ZG9zLW5mdC1pbnRlcmZhY2UifQ.mfhNGwLH2sQI0cHuuUJ4f8wULgy6tFfkGdLyZUSvq_E" })

export default function MintNFT({ isOpen, onClose, walletManager }: any) {
  const toast = useToast()

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mint a New NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ name: "", uri: null, recipient: "", denomId: "" }}
              onSubmit={async (values, actions) => {
                console.log(values)
                const created = await nftStorageClient.storeBlob(values.uri as any)
                const url = `https://ipfs.io/ipfs/${created}`
                console.log(url)
                const signer = await walletManager.offlineSigner
                const client = await SigningStargateClient.connectWithSigner(await walletManager.getRpcEndpoint(), signer);
                const res = await client.nftMintToken(walletManager.address, values.denomId, values.name, url, "", values.recipient, GasPrice.fromString("5000000000000acudos"))
                if (res.code === 0) {
                  toast({
                    title: 'NFT Minted.',
                    description: "A new NFT has been minted for you.",
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                  })
                }
                console.log(res)
                actions.setSubmitting(false)
              }}
            >
              {(props) => (
                <Form>
                  <Field name='name'>
                    {({ field, form }: any) => (
                      <>
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel>NFT name</FormLabel>
                          <Input {...field} placeholder='Name' />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      </>
                    )}
                  </Field>
                  <Field name='uri'>
                    {({ field, form }: any) => (
                      /*<FormControl mt={5} isInvalid={form.errors.symbol && form.touched.symbol}>
                        <FormLabel>NFT URI</FormLabel>
                        <Input {...field} placeholder='Symbol' />
                        <FormErrorMessage>{form.errors.symbol}</FormErrorMessage>
                      </FormControl>*/
                      <div style={{ marginTop: 15 }}>
                        <FormLabel>NFT Content</FormLabel>
                        <input id="file" name="file" type="file" onChange={(event) => {
                          props.setFieldValue("uri", event?.currentTarget?.files[0]);
                        }} />
                      </div>
                    )}
                  </Field>
                  <Field name='recipient'>
                    {({ field, form }: any) => (
                      <FormControl mt={5} isInvalid={form.errors.symbol && form.touched.symbol}>
                        <FormLabel>NFT Recipient</FormLabel>
                        <Input {...field} placeholder='Symbol' />
                        <FormErrorMessage>{form.errors.symbol}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='denomId'>
                    {({ field, form }: any) => (
                      <FormControl mt={5} isInvalid={form.errors.symbol && form.touched.symbol}>
                        <FormLabel>Denom ID</FormLabel>
                        <Input {...field} placeholder='Symbol' />
                        <FormErrorMessage>{form.errors.symbol}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <ModalFooter>
                    <Button colorScheme='teal' mr={3} isLoading={props.isSubmitting} type="submit">
                      Mint
                    </Button>
                    <Button variant='ghost' onClick={onClose}>Close</Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
