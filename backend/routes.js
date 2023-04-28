const express = require('express');
const router = express.Router();
const { checkAuth } = require("./utils/passport");

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to API page!' });
});

router.get('/hotels', (req, res) => {
  return res.json({
    success: true,
    data: [
      {
        "id": "g82h0_48gh1_4h0g8_41h8",
        "name": "Ninja Red Grape Castle",
        "location": "North 2nd Street, San Jose",
        "description": "Located at the prime location of San Jose, the property has brilliant amenities with Starbucks and Subway chains nearby.",
        "image_url": "https://t-cf.bstatic.com/xdata/images/hotel/square600/130456384.webp?k=b8cf7d16bdf688ba5549c22ebe1a4b59484f2f9aa59fc88d1d42952c696133e2&o=&s=1"
      },
      {
        "id": "g82h0_48gh1_4h0g8_41h9",
        "name": "Teddy Dope",
        "location": "South 33rd Street, San Jose",
        "description": "Located at the key market location of San Jose, the property has good amenities with hospitals, city hall nearby.",
        "image_url": "https://t-cf.bstatic.com/xdata/images/hotel/square600/325450185.webp?k=1b8ad70c33413dbf1bb02e39a65fa83277b29225386b60034c373d865e51670d&o=&s=1"
      },
      {
        "id": "g82h0_48gh1_4h0g8_41h7",
        "name": "Pink Cobra",
        "location": "West 18th Street, San Jose",
        "description": "Located at the key industrial location of San Jose, the property has major tech companies nearby.",
        "image_url": "https://t-cf.bstatic.com/xdata/images/hotel/square600/337131054.webp?k=c210721734bd863eb02b920bc7aec7fb20849d5244a23a2a0b4a05866885de41&o=&s=1"
      },
      {
        "id": "g82h0_48gh1_4h0g8_41h6",
        "name": "Orange Checkers",
        "location": "3259, Jim Street, San Jose",
        "description": "Located at the low marshland market location of San Jose, the property has major event venues nearby.",
        "image_url": "https://t-cf.bstatic.com/xdata/images/hotel/square600/169890151.webp?k=89d7ef988ef9c036ab92e758294890239541c5875ccd3e73ea94bf9db614b62d&o=&s=1"
      }
    ]
  });
});

router.get('/hotels/:hotel_id', (req, res) => {
  const { hotel_id } = req.params;
  res.json({
    success: true,
    data: {
      "id": hotel_id,
      "name": "Orange Checkers",
      "location": "3259, Jim Street, San Jose",
      "description": "Located at the low marshland market location of San Jose, the property has major event venues nearby.",
      "write_up": `
    Orange Checkers, located 1.3 miles from San Jose Airport, offers an outdoor pool and hot tub and a gym. Rooms feature free WiFi and flat-screen cable TVs.

Guest rooms are equipped with microwaves, refrigerators and desks. They also provide coffee makers and ironing facilities.

Comfort Inn & Suites Henderson serves breakfast. A business center and meeting rooms are available to guests. The hotel has laundry facilities and valet dry cleaning.

Comfort Inn is one mile from Galleria at Sunset shopping center and 3 miles from University of Southern Nevada. It is 10 miles from Las Vegas and 22 miles from Hoover Dam.

Couples in particular like the location – they rated it 8.9 for a two-person trip.`,
      "image_url": "https://t-cf.bstatic.com/xdata/images/hotel/square600/169890151.webp?k=89d7ef988ef9c036ab92e758294890239541c5875ccd3e73ea94bf9db614b62d&o=&s=1",
      "room_details": [
        {
          type: "Standard",
          description: "Basic room with bed and wardrobe",
          amenities: [],
          maxPersons: 2,
          availableNos: 5,
          price: 351
        },
        {
          type: "Deluxe",
          description: "Deluxe room with bed, hairdryer, balcony and television",
          amenities: [],
          maxPersons: 3,
          availableNos: 3,
          price: 551
        },
        {
          type: "Suite",
          description: "Deluxe room with bed, hairdryer, balcony, bathtub, shower kit, dental kit and television",
          amenities: [],
          maxPersons: 4,
          availableNos: 2,
          price: 851
        }
      ]
    }
  });
});

router.get('/bookings', (req, res) => {
  return res.json({
    success: true,
    data: [
      {
        "id": "g82h0_48gh1_4h0g8_41h8",
        "name": "Ninja Red Grape Castle",
        "location": "North 2nd Street, San Jose",
        "startDate": "May 9, 2021",
        "endDate": "May 15, 2021",
        "total": "356",
        "image_url": "https://t-cf.bstatic.com/xdata/images/hotel/square600/130456384.webp?k=b8cf7d16bdf688ba5549c22ebe1a4b59484f2f9aa59fc88d1d42952c696133e2&o=&s=1"
      },
      {
        "id": "g82h0_48gh1_4h0g8_41h9",
        "name": "Teddy Dope",
        "location": "South 33rd Street, San Jose",
        "startDate": "Mar 19, 2021",
        "endDate": "Mar 25, 2021",
        "total": "403",
        "image_url": "https://t-cf.bstatic.com/xdata/images/hotel/square600/325450185.webp?k=1b8ad70c33413dbf1bb02e39a65fa83277b29225386b60034c373d865e51670d&o=&s=1"
      },
      {
        "id": "g82h0_48gh1_4h0g8_41h7",
        "name": "Pink Cobra",
        "location": "West 18th Street, San Jose",
        "startDate": "Dec 9, 2021",
        "endDate": "Dec 15, 2021",
        "total": "856",
        "image_url": "https://t-cf.bstatic.com/xdata/images/hotel/square600/337131054.webp?k=c210721734bd863eb02b920bc7aec7fb20849d5244a23a2a0b4a05866885de41&o=&s=1"
      },
      {
        "id": "g82h0_48gh1_4h0g8_41h6",
        "name": "Orange Checkers",
        "location": "3259, Jim Street, San Jose",
        "startDate": "Sep 4, 2021",
        "endDate": "Sep 5, 2021",
        "total": "156",
        "image_url": "https://t-cf.bstatic.com/xdata/images/hotel/square600/169890151.webp?k=89d7ef988ef9c036ab92e758294890239541c5875ccd3e73ea94bf9db614b62d&o=&s=1"
      }
    ]
  });
});

router.get('/session', checkAuth, (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.session) {
    const { user } = req;
    console.log('req.session ->> ', req.session);
    res.json({ success: true, isAuthenticated: true, user: { 
      email: user.cust_email, name: user.name, username: user.cust_name, 
      phone: user.cust_phone, user_role: user.user_role,
      reward_points: user.reward_points,
      customer_type: user.customer_type,
      isLoggedIn: true
    } });
  } else {
    res.status(401).json({ message: "Not authorized", success: false });
  }
});

module.exports = router;