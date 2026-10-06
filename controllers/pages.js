const prisma = require("../prisma/client.js");

module.exports.renderLandingPage = async (req, res) => {
    try {
        // Fetch top featured listings from database
        let featuredListings = [];
        try {
            featuredListings = await prisma.listing.findMany({
                include: { images: true },
                orderBy: [
                    { averageRating: 'desc' },
                    { price: 'desc' }
                ],
                take: 6
            });
        } catch (dbErr) {
            console.warn("Prisma query fallback for landing page:", dbErr.message);
        }

        // Map images to `listing.image` format matching views
        const listingsWithImages = featuredListings.map(listing => ({
            ...listing,
            image: listing.images || []
        }));

        // Top destinations data with curated images and descriptions
        const popularDestinations = [
            {
                name: "Goa",
                tagline: "Sun-kissed beaches & heritage villas",
                staysCount: "25+ Stays",
                imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop",
                badge: "Beach Haven",
                filterUrl: "/listings?search=Goa"
            },
            {
                name: "Manali",
                tagline: "Snow-capped peaks & pine chalets",
                staysCount: "18+ Stays",
                imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop",
                badge: "Mountain Escape",
                filterUrl: "/listings?search=Manali"
            },
            {
                name: "Mumbai",
                tagline: "Skyline lofts & coastal retreats",
                staysCount: "30+ Stays",
                imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop",
                badge: "City Lights",
                filterUrl: "/listings?search=Mumbai"
            },
            {
                name: "Lonavala",
                tagline: "Misty hills & private pool estates",
                staysCount: "14+ Stays",
                imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
                badge: "Weekend Getaway",
                filterUrl: "/listings?search=Lonavala"
            },
            {
                name: "Jaipur",
                tagline: "Royal havelis & artisan sanctuaries",
                staysCount: "20+ Stays",
                imageUrl: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=800&auto=format&fit=crop",
                badge: "Heritage",
                filterUrl: "/listings?search=Jaipur"
            },
            {
                name: "Kerala",
                tagline: "Serene backwaters & spice treehouses",
                staysCount: "16+ Stays",
                imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop",
                badge: "Tropical Calm",
                filterUrl: "/listings?search=Kerala"
            }
        ];

        // Experience categories
        const experienceCategories = [
            {
                title: "Beachfront & Coastal",
                description: "Wake up to ocean breezes and private shoreline access.",
                icon: "fa-solid fa-umbrella-beach",
                categoryKey: "beachfront",
                imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600&auto=format&fit=crop"
            },
            {
                title: "Mountain Lodges & Arctic",
                description: "Cozy fireside cabins surrounded by alpine serenity.",
                icon: "fa-solid fa-mountain",
                categoryKey: "arctic",
                imageUrl: "https://images.unsplash.com/photo-1518602164578-cd0074062767?q=80&w=600&auto=format&fit=crop"
            },
            {
                title: "Villas with Private Pools",
                description: "Spacious luxury stays with secluded infinity pools.",
                icon: "fa-solid fa-person-swimming",
                categoryKey: "pools",
                imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=600&auto=format&fit=crop"
            },
            {
                title: "Handcrafted Cabins",
                description: "Artisan wooden cottages tucked into lush forests.",
                icon: "fa-solid fa-tree",
                categoryKey: "cabins",
                imageUrl: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=600&auto=format&fit=crop"
            },
            {
                title: "City Penthouses & Lofts",
                description: "Central high-rise apartments near nightlife and dining.",
                icon: "fa-solid fa-city",
                categoryKey: "towers",
                imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop"
            },
            {
                title: "Wellness & Farm Stays",
                description: "Recharge with nature walks, organic farms, and spa living.",
                icon: "fa-solid fa-spa",
                categoryKey: "wellness",
                imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop"
            }
        ];

        // Guest reviews / testimonials
        const testimonials = [
            {
                name: "Ananya Sharma",
                location: "Bengaluru, India",
                stay: "Goa Oceanfront Villa",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
                rating: 5,
                comment: "StayNest made our family vacation completely effortless. The villa matched every single photo, check-in was seamless, and the transparent pricing with zero surprise charges was refreshing!"
            },
            {
                name: "Rohan Mehta",
                location: "Delhi, India",
                stay: "Manali Log Chalet",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
                rating: 5,
                comment: "The instant booking confirmation gave us total peace of mind during peak holiday season. The fireplace, mountain trails, and attentive host made it an unforgettable weekend."
            },
            {
                name: "Priya Venkatesh",
                location: "Chennai, India",
                stay: "Lonavala Pool Estate",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
                rating: 5,
                comment: "Incredible attention to detail. Finding stays by curated experiences helped us discover a hidden gem villa we would never have found elsewhere. 10/10 recommendation!"
            }
        ];

        // Platform stats
        const stats = {
            totalStays: "1,200+",
            verifiedHosts: "850+",
            happyGuests: "24,000+",
            avgRating: "4.92"
        };

        res.render("pages/landing.ejs", {
            featuredListings: listingsWithImages,
            popularDestinations,
            experienceCategories,
            testimonials,
            stats,
            isLandingPage: true
        });
    } catch (err) {
        console.error("Error rendering landing page:", err);
        res.render("pages/landing.ejs", {
            featuredListings: [],
            popularDestinations: [],
            experienceCategories: [],
            testimonials: [],
            stats: { totalStays: "1,000+", verifiedHosts: "500+", happyGuests: "10,000+", avgRating: "4.9" },
            isLandingPage: true
        });
    }
};
