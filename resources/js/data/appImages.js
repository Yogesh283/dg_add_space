const img = (filename) => `/img/${encodeURIComponent(filename)}`;

/**
 * App / game name → image file in public/img (matched by filename meaning).
 */
export const appImages = {
    // Apps marketplace (page 1)
    'Food Delivery': img('food.webp'),
    'Taxi Booking': img('taxi.webp'),
    'E-Commerce': img('E-Commerce.jpg'),
    'Grocery': img('Grocery.png'),
    'Quiz': img('Quiz.webp'),
    'Puzzle Game': img('pzul.webp'),
    'Racing Game': img('car.webp'),
    'Fantasy Game': img('Fantasy Game.webp'),
    'Trading App': img('Trading App.webp'),
    'Education App': img('Education App.webp'),
    'Finance App': img('Finance App.webp'),
    'Social App': img('Social App.webp'),
    'MLM App': img('MLM App.webp'),
    'Crypto App': img('Crypto App.webp'),
    'Dating App': img('Dating App.webp'),
    'Restaurant App': img('Restaurant App.webp'),
    'Doctor Appointment App': img('Doctor Appointment App.webp'),
    'Hotel Booking App': img('Hotel Booking App.webp'),
    'Recharge App': img('Recharge App.webp'),
    'Video Streaming App': img('Video Streaming App.webp'),
    'Chat Application': img('Chat Application.webp'),
    'News App': img('News App.webp'),
    'Music App': img('Music App.webp'),

    // Game store (page 2)
    'Quiz Game': img('Quiz.webp'),
    'Ludo Game': img('OIP.webp'),
    'Car Parking Game': img('carim.jpg'),
    'Bike Racing': img('chas.webp'),
    'Fantasy Sports': img('Fantasy Game.webp'),
    'Hyper Casual Game': img('Arrow pzul.webp'),
};

export const heroBannerImage = img('landing-game-hero.png');

export const landingBanners = [
    {
        src: img('banner-playstore.png'),
        title: 'Play Store Publishing',
        desc: 'Launch your game on Google Play Store with complete listing support.',
    },
    {
        src: img('banner-admob.png'),
        title: 'AdMob Monetization',
        desc: 'Integrate ads and start earning from active users.',
    },
    {
        src: img('banner-marketing.png'),
        title: 'Digital Marketing Growth',
        desc: 'Grow downloads, engagement, and long-term user reach.',
    },
];

export function getAppImage(name, fallback = heroBannerImage) {
    return appImages[name] ?? fallback;
}
