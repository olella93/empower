import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Menu as MenuIcon,
  Close,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redux selectors
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const cartItemsCount = 0; // TODO: Get from cart state

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    // TODO: Dispatch logout action
    handleUserMenuClose();
    navigate('/');
  };

  const renderDesktopNav = () => (
    <>
      {/* Logo */}
      {/* Brand/Logo */}
      <Box
        component={Link}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
          color: 'inherit',
          flexGrow: 1,
        }}
      >
        <img
          src="/logo.png"
          alt="Empower"
          style={{
            height: '40px',
            marginRight: '12px',
          }}
        />
        <Typography
          variant="h4"
          component="div"
          sx={{
            color: 'inherit',
            fontWeight: 'bold',
            fontFamily: '"Poppins", sans-serif',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          EMPOWER
        </Typography>
      </Box>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {menuItems.map((item) => (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            color="inherit"
            sx={{
              fontWeight: location.pathname === item.path ? 600 : 400,
              borderBottom: location.pathname === item.path ? 2 : 0,
              borderColor: 'secondary.main',
              borderRadius: 0,
              py: 1,
            }}
          >
            {item.label}
          </Button>
        ))}

        {/* Cart Icon */}
        <IconButton
          component={Link}
          to="/cart"
          color="inherit"
          sx={{ ml: 1 }}
        >
          <Badge badgeContent={cartItemsCount} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>

        {/* User Menu */}
        {isAuthenticated ? (
          <>
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ ml: 1 }}
            >
              <Person />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleUserMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem
                component={Link}
                to="/profile"
                onClick={handleUserMenuClose}
              >
                Profile
              </MenuItem>
              <MenuItem
                component={Link}
                to="/orders"
                onClick={handleUserMenuClose}
              >
                My Orders
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button
              component={Link}
              to="/login"
              color="inherit"
              sx={{ ml: 1 }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="outlined"
              color="inherit"
              sx={{ ml: 1 }}
            >
              Register
            </Button>
          </>
        )}
      </Box>
    </>
  );

  const renderMobileNav = () => (
    <>
      {/* Mobile Menu Button */}
      <IconButton
        color="inherit"
        onClick={handleMobileMenuToggle}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>

      {/* Logo */}
      <Typography
        variant="h5"
        component={Link}
        to="/"
        sx={{
          flexGrow: 1,
          textDecoration: 'none',
          color: 'inherit',
          fontWeight: 'bold',
        }}
      >
        EMPOWER
      </Typography>

      {/* Cart Icon */}
      <IconButton
        component={Link}
        to="/cart"
        color="inherit"
      >
        <Badge badgeContent={cartItemsCount} color="secondary">
          <ShoppingCart />
        </Badge>
      </IconButton>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleMobileMenuToggle}
          onKeyDown={handleMobileMenuToggle}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              EMPOWER
            </Typography>
            <IconButton onClick={handleMobileMenuToggle}>
              <Close />
            </IconButton>
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  color: location.pathname === item.path ? 'primary.main' : 'inherit',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            {!isAuthenticated && (
              <>
                <ListItem component={Link} to="/login">
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem component={Link} to="/register">
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}

            {isAuthenticated && (
              <>
                <ListItem component={Link} to="/profile">
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem component={Link} to="/orders">
                  <ListItemText primary="My Orders" />
                </ListItem>
                <ListItem onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        {isMobile ? renderMobileNav() : renderDesktopNav()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
