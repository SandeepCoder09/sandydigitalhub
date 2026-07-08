"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Local Business Owner",
    content: "Sandy Digital Hub transformed my business with an amazing e-commerce website. Their support is top-notch and pricing is very affordable.",
    rating: 5,
    initials: "RS",
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Student",
    content: "I needed help with some online applications and resume building. They guided me perfectly and made the process so smooth.",
    rating: 5,
    initials: "PS",
  },
  {
    id: 3,
    name: "Amit Patel",
    role: "Startup Founder",
    content: "We hired them for our mobile app development. The team is highly skilled, delivered on time, and the app runs flawlessly.",
    rating: 5,
    initials: "AP",
  },
];

export function CustomerReviews() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it. Here is what people are saying about Sandy Digital Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card p-8 rounded-2xl border shadow-sm relative"
            >
              <div className="flex gap-1 mb-6 text-primary">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-8 relative z-10 italic">
                "{review.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary">{review.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{review.name}</div>
                  <div className="text-sm text-muted-foreground">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
