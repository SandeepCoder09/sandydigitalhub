"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @typescript-eslint/no-require-imports, @next/next/no-img-element, @next/next/no-sync-scripts, react/no-unescaped-entities */

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/Toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number is required." }),
  service: z.string().min(2, { message: "Please select or type the required service." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export default function ContactPage() {
  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>("");
  const [customService, setCustomService] = useState<string>("");

  const serviceOptions = [
    "Website Development & Web App",
    "Mobile App Development",
    "Passport / Visa Size Photo Generator",
    "PAN Card & Official Govt Document Services",
    "GST & Business Tax Registration",
    "Graphic Design & Branding / Logo",
    "Image Compression & Format Conversion",
    "Cyber Cafe & Digital Document Printing",
    "Other (Type Custom Service)",
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Message sent successfully! We will contact you soon.", "Thank You!");
    form.reset();
    setSelectedServiceCategory("");
    setCustomService("");
  }

  return (
    <div className="py-16 md:py-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF4500] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} /> Get Fast Support
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl text-gray-900">
            Contact <span className="text-[#FF4500]">Sandy Digital Hub</span>
          </h1>
          <p className="text-lg text-gray-600">
            Have a project in mind or need digital assistance? Reach out to us today for high-speed solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
          {/* Contact Info Card */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl shadow-orange-500/5 hover:border-[#FF4500]/30 transition-all">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-orange-100/80 text-[#FF4500] shrink-0 font-bold shadow-inner">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Visit Our Office</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Bairi, Khakhreru, Fatehpur,<br />Uttar Pradesh, India - 212656
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-orange-100/80 text-[#FF4500] shrink-0 font-bold shadow-inner">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Call / WhatsApp</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <a href="https://wa.me/918756454282" target="_blank" rel="noreferrer" className="text-[#FF4500] font-bold hover:underline">
                        +91 87564 54282
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-orange-100/80 text-[#FF4500] shrink-0 font-bold shadow-inner">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Email Us</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <a href="mailto:support@sandydigitalhub.com" className="text-gray-800 hover:text-[#FF4500] transition-colors">
                        support@sandydigitalhub.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-orange-100/80 text-[#FF4500] shrink-0 font-bold shadow-inner">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Business Hours</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Monday - Saturday: 8:00 AM - 9:00 PM<br />
                      Sunday: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Chat Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl text-white shadow-xl flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg">Need Immediate Assistance?</h3>
                <p className="text-xs text-white/90 mt-1">Chat directly with Sandy Support on WhatsApp</p>
              </div>
              <a
                href="https://wa.me/918756454282?text=Hello%20Sandy%20Digital%20Hub,%20I%20need%20assistance"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-green-700 px-4 py-2.5 rounded-2xl font-bold text-xs hover:bg-gray-100 transition-transform active:scale-95 shadow-md shrink-0"
              >
                <MessageCircle size={16} /> WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl shadow-orange-500/5">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-gray-800">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Rahul Sharma" className="h-12 border-gray-300 rounded-xl focus:border-[#FF4500]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-gray-800">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" className="h-12 border-gray-300 rounded-xl focus:border-[#FF4500]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-gray-800">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="rahulsharma@example.com" className="h-12 border-gray-300 rounded-xl focus:border-[#FF4500]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Service Required Dropdown with Custom Option */}
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-gray-800">Service Required</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <select
                            value={selectedServiceCategory}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSelectedServiceCategory(val);
                              if (val === "Other (Type Custom Service)") {
                                field.onChange(customService || "Custom Service Request");
                              } else {
                                field.onChange(val);
                              }
                            }}
                            className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium text-sm focus:ring-2 focus:ring-[#FF4500] focus:border-[#FF4500] outline-none shadow-sm transition-all cursor-pointer"
                          >
                            <option value="" disabled>-- Select Service Category --</option>
                            {serviceOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>

                          {selectedServiceCategory === "Other (Type Custom Service)" && (
                            <Input
                              type="text"
                              value={customService}
                              onChange={(e) => {
                                const text = e.target.value;
                                setCustomService(text);
                                field.onChange(text);
                              }}
                              placeholder="Type your custom service or project requirement here..."
                              className="h-12 border-gray-300 rounded-xl bg-white text-gray-900 shadow-sm focus:border-[#FF4500]"
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-gray-800">Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your project or inquiry..."
                          className="min-h-[120px] border-gray-300 rounded-xl focus:border-[#FF4500] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold text-base rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Interactive Google Map */}
        <div className="mt-20 rounded-3xl overflow-hidden border border-gray-200 shadow-md bg-white relative">
          <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg sm:text-xl">Find Us On Google Maps</h3>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                Bairi, Khakhreru, Fatehpur, Uttar Pradesh, India - 212656
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=Khakhreru,+Fatehpur,+Uttar+Pradesh+212656"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold text-xs sm:text-sm transition-colors shadow-md shadow-orange-200 w-fit"
            >
              <MapPin className="w-4 h-4" /> Open Directions in Google Maps
            </a>
          </div>
          <div className="w-full h-[400px] sm:h-[450px]">
            <iframe
              src="https://maps.google.com/maps?q=Khakhreru,+Fatehpur,+Uttar+Pradesh+212656&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sandy Digital Hub Google Map Location"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
