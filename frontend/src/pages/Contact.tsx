import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  WhatsApp as WhatsAppIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <LocationIcon />,
      title: 'Visit Our Store',
      details: ['Marsabit Plaza', 'Ngong Road', 'Nairobi, Kenya'],
    },
    {
      icon: <PhoneIcon />,
      title: 'Call Us',
      details: ['+254 712 345 678', '+254 733 456 789'],
    },
    {
      icon: <EmailIcon />,
      title: 'Email Us',
      details: ['info@empowerfashion.co.ke', 'support@empowerfashion.co.ke'],
    },
    {
      icon: <ScheduleIcon />,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 8:00 PM', 'Sat: 9:00 AM - 6:00 PM', 'Sun: 10:00 AM - 4:00 PM'],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, label: 'Facebook', url: '#' },
    { icon: <InstagramIcon />, label: 'Instagram', url: '#' },
    { icon: <TwitterIcon />, label: 'Twitter', url: '#' },
    { icon: <WhatsAppIcon />, label: 'WhatsApp', url: '#' },
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
          <Typography variant="h2" component="h1" textAlign="center" gutterBottom>
            Get In Touch
          </Typography>
          <Typography variant="h5" textAlign="center" sx={{ opacity: 0.9 }}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={6}>
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom color="primary">
                Send Us a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Have a question about our products or services? We're here to help!
              </Typography>

              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your message! We'll get back to you within 24 hours.
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={6}
                      variant="outlined"
                      placeholder="Tell us how we can help you..."
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<SendIcon />}
                      sx={{ minWidth: 200 }}
                      disabled={submitted}
                    >
                      {submitted ? 'Message Sent!' : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom color="primary">
                Contact Information
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Reach out to us through any of these channels
              </Typography>

              {contactInfo.map((info, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Box sx={{ color: 'secondary.main', mt: 0.5 }}>
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {info.title}
                        </Typography>
                        {info.details.map((detail, idx) => (
                          <Typography
                            key={idx}
                            variant="body2"
                            color="text.secondary"
                          >
                            {detail}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Social Media Links */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Follow Us
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Stay connected on social media
                </Typography>
                <Box display="flex" gap={2}>
                  {socialLinks.map((social, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      size="small"
                      startIcon={social.icon}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {social.label}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom color="primary">
            Frequently Asked Questions
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ mb: 6, color: 'text.secondary' }}>
            Quick answers to common questions
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  What are your delivery options?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We offer free delivery within Nairobi CBD for orders over KSh 5,000. 
                  Standard delivery takes 1-3 business days. Express delivery (same day) 
                  is available for an additional fee.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  What is your return policy?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We accept returns within 30 days of purchase. Items must be in original 
                  condition with tags attached. Refunds are processed within 5-7 business days.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Do you offer personal styling services?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes! Book a consultation with our style experts. We offer both in-store 
                  and virtual styling sessions to help you find the perfect look.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  How can I track my order?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Once your order ships, you'll receive a tracking number via email and SMS. 
                  You can also track your order by logging into your account on our website.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Map Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom color="primary">
          Find Us Here
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ mb: 6, color: 'text.secondary' }}>
          Visit our flagship store in Nairobi
        </Typography>
        
        <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 2 }}>
          <Box
            sx={{
              width: '100%',
              height: 400,
              bgcolor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
            }}
          >
            <Box textAlign="center">
              <LocationIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6">
                Interactive Map Coming Soon
              </Typography>
              <Typography variant="body2">
                Marsabit Plaza, Ngong Road, Nairobi
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;
