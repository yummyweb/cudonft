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

export default function CreateNFT({ isOpen, onClose, walletManager }: any) {
  const toast = useToast()

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ name: "", symbol: "" }}
              onSubmit={async (values, actions) => {
                console.log(values)
                const signer = await walletManager.offlineSigner
                const client = await SigningStargateClient.connectWithSigner(await walletManager.getRpcEndpoint(), signer);
                const fee = {
                  amount: [{ denom: "acudos", amount: "5000000000000acudos" }],
                  gas: "auto"
                }
                /*const chainId = chains.find(
                  (chain: any) => chain.chain_name === chainName
                )?.chain_id*/
                console.log(values.symbol.toLowerCase())
                const denom: any = {
                  sender: walletManager.address,
                  id: values.symbol.toLowerCase(),
                  name: values.name,
                  schema: '',
                  symbol: values.symbol,
                  traits: "",
                  minter: "",
                  description: "",
                  data: "",
                  gasPrice: ""
                }
                const res = await client.nftIssueDenom(walletManager.address, values.symbol.toLowerCase(), values.name, '', values.symbol, "", "", "", "", GasPrice.fromString("5000000000000acudos"))
                // const res = await client.signAndBroadcast(walletManager.address, [issueMsg], fee)
                if (res.code === 0) {
                  toast({
                    title: 'NFT Denom Issued.',
                    description: "A new NFT denomination has been issued for you.",
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
                          <FormLabel>Denom name</FormLabel>
                          <Input {...field} placeholder='Name' />
                          <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                        </FormControl>
                      </>
                    )}
                  </Field>
                  <Field name='symbol'>
                    {({ field, form }: any) => (
                      <FormControl mt={5} isInvalid={form.errors.symbol && form.touched.symbol}>
                        <FormLabel>Denom symbol</FormLabel>
                        <Input {...field} placeholder='Symbol' />
                        <FormErrorMessage>{form.errors.symbol}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <ModalFooter>
                    <Button colorScheme='teal' mr={3} isLoading={props.isSubmitting} type="submit">
                      Create
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
