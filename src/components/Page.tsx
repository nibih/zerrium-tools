import { Fragment, useEffect, useState } from 'react'
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  CloseButton,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { FiMenu } from 'react-icons/fi'
import { IconType } from 'react-icons'
import { Footer } from "./Footer"
import { LinkItems } from "./Router"
// @ts-ignore
import { isDesktop } from "react-device-detect"
import { Outlet, useLocation } from 'react-router-dom'
import { FaSearch } from "react-icons/fa"


const findAccordationIndex = (url: string) => {
  // @ts-ignore
  const a = LinkItems.filter((link) => link.child).map((i) => i.child.map((j) => j.link))
  let temp = -1
  a.forEach((i) => {
    const j = i.indexOf(url)
    if (j !== -1) {
      temp = a.indexOf(i)
    }
  })
  return temp
}

const Page = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const isTouchScreenDevice = () => {
  //   try{
  //     document.createEvent('TouchEvent');
  //     return true;
  //   }catch(e){
  //     return false;
  //   }
  // }

  return (
    <Box>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }}/>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose}/>
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} position="fixed" w="100%"/>
      <Box ml={{ base: 0, md: "30%", lg: "25%", xl: "20%", "2xl": "17%" }}>
        <Box position="fixed" right="0" zIndex="9999" p="5" display={{ base: "none", md: "block" }}>
          <ColorModeSwitcher/>
        </Box>
        <Box px="25" pb="120" pt={{ base: "100", md: "15" }}>
          <Outlet />
        </Box>
        <Box position="absolute" bottom="0" left="0" right="0"
             ml={{ base: 0, md: "30%", lg: "25%", xl: "20%", "2xl": "17%" }}>
          <Footer/>
        </Box>
      </Box>
    </Box>
  )
}

interface SidebarProps extends BoxProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const activeColor = useColorModeValue("green.200", "green.800")
  const { pathname } = useLocation()
  const [url, setUrl] = useState<string>(pathname.replace("/", ""))
  const [search, setSearch] = useState<string>("")
  const [indexExpanded, setIndexExpanded] = useState<number[] | undefined>(undefined)

  const accordationIndex = findAccordationIndex(url)

  useEffect(() => {
    setUrl(pathname.replace("/", ""))
  }, [pathname]);

  useEffect(() => {
    if (search.length > 0) {
      const indexList = LinkItems.map((link, index) => {
        if (link.child && link.child.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.link === url).length > 0) {
          return index - 1
        }
        return undefined
      }).filter((i) => i !== undefined)
      setIndexExpanded(indexList.length === 0 ? undefined : indexList as number[])
    } else {
      setIndexExpanded(undefined)
    }
  }, [search, url])

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: "30%", lg: "25%", xl: "20%", "2xl": "17%" }}
      pos="fixed"
      h="full"
      {...rest}
      overflowY="scroll">
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Zerrium Tools
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose}/>
      </Flex>
      <Flex mx="3" mb="3">
        <InputGroup size='lg' width="100%" margin={"auto"}>
          <Input
              pr="4.5rem"
              type="text"
              autoFocus
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />
          <InputRightElement width='3.3rem'>
              <IconButton
                  size="md"
                  fontSize="1.35rem"
                  variant="ghost"
                  color="current"
                  icon={<FaSearch />}
                  aria-label="Search"
              />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Box>
        <Accordion allowMultiple width="100%" maxW="lg" rounded="lg" defaultIndex={indexExpanded ? undefined : [accordationIndex]} index={indexExpanded ? new Array(indexExpanded?.length).fill(null).map((_, i) => i) : undefined}>
          {LinkItems.map((link, index) => (
            <Fragment key={link.name}>
              {link.child ? (
                ((indexExpanded && indexExpanded.filter((i) => i === (index - 1)).length > 0) || search.length === 0) && (
                  <AccordionItem key={link.name}>
                    <AccordionButton
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      p={4}
                      _hover={{
                        bg: 'green.300',
                        color: 'white',
                      }}>
                      <Box w="100%" display="flex">
                        {link.icon ? (
                          <>
                            <Icon
                              mr="4"
                              mt="1"
                              fontSize="16"
                              _groupHover={{
                                color: 'white',
                              }}
                              as={link.icon}
                            />
                            <Text fontSize="md">{link.name}</Text>
                          </>
                        ) : (
                          <Text ml="8" fontSize="md">{link.name}</Text>
                        )}
                      </Box>
                      <AccordionIcon/>
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {link.child.map((child) => (
                        ((search.length === 0 || url === child.link || child.name.toLowerCase().includes(search.toLowerCase())) && (
                          <NavItem key={child.name} href={/*basename + */child.link} fontWeight={url === child.link ? "bold" : "none"}
                                background={url === child.link ? activeColor : "none"}>
                          {child.name}
                        </NavItem>
                        ))
                      ))}
                    </AccordionPanel>
                  </AccordionItem>
                )
              ) : (
                <NavItem key={link.name} icon={link?.icon} ps={link.icon ? "4" : "12"} href={/*basename + */(link.link || "#")}
                         fontWeight={url === link.link || (index === 0 && url.length === 0) ? "bold" : "none"}
                         background={url === link.link || (index === 0 && url.length === 0) ? activeColor : "none"}>
                  {link.name}
                </NavItem>
              )}
            </Fragment>
          ))}
        </Accordion>
      </Box>
      { !isDesktop && (
        <Box h="25%"></Box>
      )}
    </Box>
  )
}

interface NavItemProps extends FlexProps {
  icon?: IconType
  href?: string
  children: string | number
}

const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href={href || "#"}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'green.300',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  )
}

interface MobileProps extends FlexProps {
  onOpen: () => void
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: "30%", lg: "25%", xl: "20%", "2xl": "17%" }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent="flex-start"
      {...rest}
      zIndex={999}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu/>}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Zerrium Tools
      </Text>
      <Box position="absolute" right="0" p="5" display={{ base: "block", md: "none" }}>
        <ColorModeSwitcher/>
      </Box>
    </Flex>
  )
}

export default Page;