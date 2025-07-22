import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        mt: 'auto',
        pt: 6,
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <img
                src="/logo.png"
                alt="Empower Logo"
                style={{
                  height: '40px',
                  marginRight: '12px',
                  filter: 'brightness(0) invert(1)', // Make logo white
                }}
              />
              <Typography variant="h5" fontWeight="bold">
                EMPOWER
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Elevating your style with premium fashion collections. 
              Discover the latest trends and timeless pieces at Kenya's 
              premier fashion destination.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component="a"
                href="https://facebook.com"
                target="_blank"
                sx={{ color: 'white', '&:hover': { color: 'secondary.light' } }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com"
                target="_blank"
                sx={{ color: 'white', '&:hover': { color: 'secondary.light' } }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                sx={{ color: 'white', '&:hover': { color: 'secondary.light' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                sx={{ color: 'white', '&:hover': { color: 'secondary.light' } }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/shop"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Shop
              </Link>
              <Link
                component={RouterLink}
                to="/about"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                About Us
              </Link>
              <Link
                component={RouterLink}
                to="/contact"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Contact
              </Link>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                component={RouterLink}
                to="/shop/dresses"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Dresses
              </Link>
              <Link
                component={RouterLink}
                to="/shop/tops"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Tops
              </Link>
              <Link
                component={RouterLink}
                to="/shop/bottoms"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Bottoms
              </Link>
              <Link
                component={RouterLink}
                to="/shop/accessories"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Accessories
              </Link>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Customer Care
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Size Guide
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Return Policy
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                Shipping Info
              </Link>
              <Link
                href="#"
                color="inherit"
                sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.light' } }}
              >
                FAQ
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={12} md={3}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  Marsabit Plaza, Ngong Road<br />
                  Nairobi, Kenya
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  +254 700 123 456
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  hello@empowerfashion.co.ke
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
              <strong>Store Hours:</strong><br />
              Mon - Sat: 9:00 AM - 8:00 PM<br />
              Sun: 10:00 AM - 6:00 PM
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} Empower Fashion. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link
              href="#"
              color="inherit"
              sx={{ textDecoration: 'none', fontSize: '0.875rem', opacity: 0.8 }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ textDecoration: 'none', fontSize: '0.875rem', opacity: 0.8 }}
            >
              Terms of Service
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
