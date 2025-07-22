import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Star as StarIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      description: 'Passionate about empowering people through fashion',
      avatar: '/api/placeholder/150/150'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Design',
      description: 'Creating beautiful and sustainable fashion pieces',
      avatar: '/api/placeholder/150/150'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience Manager',
      description: 'Ensuring every customer feels valued and heard',
      avatar: '/api/placeholder/150/150'
    },
  ];

  const values = [
    {
      icon: <StoreIcon />,
      title: 'Quality First',
      description: 'We source only the finest materials and work with skilled artisans to ensure every piece meets our high standards.',
    },
    {
      icon: <PeopleIcon />,
      title: 'Empowerment',
      description: 'Fashion should make you feel confident and empowered. We design pieces that celebrate individuality.',
    },
    {
      icon: <SecurityIcon />,
      title: 'Sustainability',
      description: 'We are committed to ethical manufacturing and sustainable practices throughout our supply chain.',
    },
    {
      icon: <SupportIcon />,
      title: 'Customer Care',
      description: 'Your satisfaction is our priority. Our team is always ready to help with any questions or concerns.',
    },
  ];

  const achievements = [
    { number: '50,000+', label: 'Happy Customers' },
    { number: '10+', label: 'Years Experience' },
    { number: '500+', label: 'Fashion Items' },
    { number: '99%', label: 'Customer Satisfaction' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2C3E50 0%, #34495E 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                About Empower
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                Empowering Your Style, Celebrating Your Uniqueness
              </Typography>
              <Typography variant="body1" sx={{ fontSize: 18, lineHeight: 1.6 }}>
                Since our founding, Empower has been more than just a fashion brand. 
                We're a movement dedicated to helping people express their authentic selves 
                through carefully curated, high-quality fashion pieces that inspire confidence 
                and celebrate individuality.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/api/placeholder/600/400"
                alt="Empower Fashion Store"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/api/placeholder/500/600"
              alt="Our Story"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom color="primary">
              Our Story
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: 16, lineHeight: 1.7 }}>
              Founded in Nairobi, Kenya, Empower began as a small boutique with a big dream: 
              to create fashion that empowers people to be their authentic selves. What started 
              as a passion project has grown into a beloved brand that serves customers across 
              East Africa and beyond.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: 16, lineHeight: 1.7 }}>
              Located in the heart of Nairobi at Marsabit Plaza on Ngong Road, our flagship 
              store has become a destination for fashion enthusiasts seeking quality, style, 
              and authenticity. Every piece in our collection is carefully selected or designed 
              to meet our high standards of quality and style.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 16, lineHeight: 1.7 }}>
              Today, we continue to grow while staying true to our core mission: empowering 
              people through fashion that makes them feel confident, beautiful, and uniquely themselves.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* Our Values Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8, mb: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom color="primary">
            Our Values
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ mb: 6, color: 'text.secondary' }}>
            The principles that guide everything we do
          </Typography>
          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    textAlign: 'center', 
                    p: 2,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: 'secondary.main', mb: 2 }}>
                      {React.cloneElement(value.icon, { fontSize: 'large' })}
                    </Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Achievements Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom color="primary">
          Our Journey in Numbers
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ mb: 6, color: 'text.secondary' }}>
          Milestones that reflect our commitment to excellence
        </Typography>
        <Grid container spacing={4}>
          {achievements.map((achievement, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h3" component="div" gutterBottom fontWeight="bold">
                  {achievement.number}
                </Typography>
                <Typography variant="body1">
                  {achievement.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Team Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom color="primary">
            Meet Our Team
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ mb: 6, color: 'text.secondary' }}>
            The passionate people behind Empower
          </Typography>
          <Grid container spacing={4}>
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    p: 3,
                    height: '100%',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      mx: 'auto', 
                      mb: 2,
                      border: '4px solid',
                      borderColor: 'secondary.main',
                    }}
                  />
                  <Typography variant="h6" component="h3" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="secondary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Location Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h2" gutterBottom color="primary">
              Visit Our Store
            </Typography>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Experience Empower in person
            </Typography>
            <List sx={{ mt: 3 }}>
              <ListItem>
                <ListItemIcon>
                  <StoreIcon color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary="Marsabit Plaza, Ngong Road, Nairobi, Kenya"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ShippingIcon color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary="Free Delivery"
                  secondary="Within Nairobi CBD for orders over KSh 5,000"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <StarIcon color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary="Personal Styling"
                  secondary="Book a consultation with our style experts"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: 400,
                bgcolor: 'grey.200',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="h6">
                Store Location Map
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
