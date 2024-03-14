import { useState, useEffect } from 'react';
import {
  Tabs, TabList, Tab, TabPanel, TabPanels, Button, Menu, MenuButton, MenuList,
  MenuItem, IconButton, Badge, Flex
} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons';
import './App.css';
import ListRecipes from './Components/ListRecipes';
import ShoppingList from "./Components/ShoppingList";
import Login from "./Components/Login";
import CreateNewUser from './Components/CreateNewUser';
import { useAxios } from './hooks/useAxios';
import { useAuth } from './hooks/useAuth';
import CreateRecipe from './Components/CreateRecipe';
import { useNotification } from './hooks/useNotification';

function App() {
  const { setToken, token } = useAuth();
  const { get } = useAxios();
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileRoute, setMobileRoute] = useState<string>('');

  const { showNotification } = useNotification();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };
    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getAuthUser = async () => {
      try {
        const user = await get('/auth/access-token', { withCredentials: true });
        setToken({ token: user.data.token, username: user.data.username, id: user.data.id });
      } catch (err) {
        console.log('not logged in');
      }
    };
    getAuthUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    try {
      await get('/auth/logout', { withCredentials: true });
      setToken(null);
    }
    catch {
      showNotification('Failed to log out', 'error');
    }
  };

  if (!token) {
    return (
      <Flex align='center' justify='center'>
        <Tabs isFitted variant='enclosed' colorScheme='customYellow' width={{ md: '600px' }}>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <CreateNewUser />
            </TabPanel>
          </TabPanels>
        </Tabs></Flex>
    );
  } else {
    if (isMobileView) {
      const returnMobileRoute = () => {
        switch (mobileRoute) {
          case "view":
            return <ListRecipes isMobile={true} />;
          case "create":
            return <CreateRecipe />;
          case "shopping-cart":
            return <ShoppingList isMobile={true} />;
          default:
            return <ListRecipes isMobile={true} />;
        }
      };
      return (
        <div style={{ position: 'relative', height: '100vh' }}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<HamburgerIcon />}
              variant='outline'
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
              }}
            />
            <MenuList>
              <MenuItem onClick={() => setMobileRoute("view")}>Discover recipes</MenuItem>
              <MenuItem onClick={() => setMobileRoute("create")}>Create recipe</MenuItem>
              <MenuItem onClick={() => setMobileRoute("shopping-cart")}>Shopping list</MenuItem>
              <MenuItem onClick={() => handleLogout()}>Log out</MenuItem>
            </MenuList>
          </Menu>
          {returnMobileRoute()}
        </div>
      );
    } else if (!isMobileView) {
      return (
        <div>
          <Tabs variant='enclosed' colorScheme='customYellow'>
            <TabList style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Tab>Discover recipes</Tab>
                <Tab>Create recipe</Tab>
                <Tab>Shopping list</Tab>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Badge fontSize='0.8em' colorScheme='customGreen' mr='2' variant='solid' >
                  User: {token.username} logged in
                </Badge>
                <Button colorScheme='customCoyote' onClick={() => handleLogout()}>Log out</Button>
              </div>
            </TabList>

            <TabPanels>
              <TabPanel>
                <ListRecipes isMobile={false} />
              </TabPanel>
              <TabPanel>
                <CreateRecipe />
              </TabPanel>
              <TabPanel>
                <ShoppingList isMobile={false} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      );
    }
  }
}

export default App;