import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Software {
  testimonies?: {
    testimonyId: string;
    softwareId: string;
    userName: string;
    companyName: string | null;
    designation: string | null;
    industry: string;
    features: string[] | null;
    testimony: string;
  }[];
}

export function TestimonialsCarousel({ software }: { software: Software }) {
  return (
    <>
      {/* Testimonials */}
      {software?.testimonies && software?.testimonies.length > 0 && (
        <section id="testimonies" className="py-[60px] bg-[#F8F2FF]">
          <div className="container mx-auto px-4">

            {/* Carousel */}
            <div className="relative max-w-6xl mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                {/* Header */}
                <div className="text-center mb-12">
                  <span className="inline-block px-4 py-0.5 bg-white rounded-full text-[14px] font-normal text-gray-800 border mb-6">
                    TESTIMONIALS
                  </span>
                  <div className="flex justify-center">
    
                  <h2 className="text-4xl md:text-5xl font-bold">
                    <span className="text-indigo bg-[#F3E8FA] px-4 rounded-xl">Our customers</span>{" "}
                    <span className="text-[#161616]">speak for us</span>
                  </h2>
                  {/* Navigation Buttons */}
                  {
                    software?.testimonies.length > 3 && (
                      <>
                  <CarouselPrevious className="bg-white hover:bg-gray-50 border shadow-md" />
                    <CarouselNext className="bg-white hover:bg-gray-50 border shadow-md" />
                      </>
                    )
                  }
                  </div>
                </div>
                <CarouselContent className="-ml-2 md:-ml-4">
                  {software.testimonies.map((testimony, index) => (
                    <CarouselItem key={index} className={`pl-2 md:pl-4 ${
                      software?.testimonies?.length === 1 
                        ? 'md:basis-full' 
                        : software?.testimonies?.length === 2 
                          ? 'md:basis-1/2' 
                          : 'md:basis-1/3'
                    }`}>
                      <Card className="h-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border-0">
                        <CardContent className="p-8">
                          {/* Company Logo Placeholder */}
                          <div className="mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {testimony.companyName?.charAt(0) || 'C'}
                              </span>
                            </div>
                          </div>

                          {/* Company Info */}
                          <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {testimony.companyName}
                            </h3>
                            <p className="text-[14px] text-[#8E8E8E] font-sans font-normal">
                              {testimony.designation}
                            </p>
                          </div>

                          {/* Testimonial Text */}
                          {testimony.testimony && (
                            <blockquote className="text-[#464646] font-sans text-[16px] font-semibold leading-relaxed">
                              {testimony.testimony}"
                            </blockquote>
                          )}

                          {/* User Name */}
                          {testimony.userName && (
                            <div className="mt-6 pt-4 border-t border-gray-100">
                              <p className="font-medium text-gray-900">
                                {testimony.userName}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                
              </Carousel>
            </div>
          </div>
        </section>
      )}
    </>
  )
}