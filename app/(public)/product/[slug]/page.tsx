import React from "react";
import { notFound } from "next/navigation";
import { getSoftwareBySlug } from "@/services/software.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRightIcon,
  Check,
  PhoneIcon,
  Share2Icon,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TestimonialsCarousel } from "@/components/product/TestimonialsSection";
import { GallerySection } from "@/components/product/GallerySection";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getSoftwareBySlug(slug);

  if (result.status == 404) {
    console.log("result - ", result);
    notFound();
  }
  if (result.status == 200) {
    const software = result.data;

    return (
      <div>
        <div className="px-20 xl:px-36 mx-auto my-5">
          {/* Header Section */}
          <div className="p-[40px] flex flex-col justify-between mb-5 rounded-2xl bg-[url('/pink-bg.svg')] bg-cover bg-center bg-no-repeat">
            {/* Added styling for container */}

            <div className="flex flex-col md:flex-row items-start gap-8">
              {" "}
              {/* Adjusted for layout */}
              <div className="w-36 h-36 relative flex-shrink-0">
                {" "}
                {/* Logo */}
                {software?.logo ? (
                  <Image
                    width={150}
                    height={150}
                    src={software.logo}
                    alt={software.softwareName}
                    className="w-full h-full object-contain bg-white rounded-lg drop-shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center shadow">
                    <span className="text-gray-400">No logo</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-row justify-between">
                {" "}
                {/* Details and Buttons Container */}
                <div className="">
                  <h1 className="text-[46px] mb-2 leading-none font-bold text-[#0A1837]">
                    {software?.softwareName}
                  </h1>
                  {/* Assuming 'By Attio Ltd' is part of description or another field, keeping description for now */}
                  <p className="text-gray-600 mb-4">By XYZ Ltd</p>

                  {/* SoftwareHunt Rating and Last Updated */}
                  <div className="flex flex-col items-start gap-1 font-sans">
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-2 font-normal">
                        SoftwareHunt Rating
                      </span>
                      <Star className="w-5 h-5 fill-[#F79C30] text-[#F79C30]" />
                      <span className="ml-1 text-gray-700">
                        {software?.overallRating} / 10
                      </span>{" "}
                      {/* Using assumed rating field */}
                    </div>
                    <span className="text-sm text-gray-600">
                      Last updated on{" "}
                      {software?.updatedAt &&
                        software?.updatedAt.toLocaleDateString()}
                    </span>{" "}
                    {/* Using assumed date field */}
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex flex-col items-center justify-end gap-4 mt-4">
                  {" "}
                  {/* Buttons Container */}
                  {software?.website && (
                    <Link
                      href={software.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full text-sm font-medium border border-black bg-transparent h-10 px-4 py-2" // Example button styling
                    >
                      <ArrowRightIcon className="mr-2 h-4 w-4" /> Visit Website{" "}
                      {/* Assuming you have an ArrowRightIcon */}
                    </Link>
                  )}
                  {/* New "Talk to expert" button */}
                  <Link
                    href={"/contact-us"}
                    className="inline-flex items-center justify-center text-sm font-medium bg-indigo text-primary-foreground rounded-full hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    {" "}
                    {/* Example button styling */}
                    <PhoneIcon className="mr-2 h-4 w-4" />{" "}
                    {/* Assuming you have a PhoneIcon */}
                    Talk to expert
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 justify-between mb-5">
            {/* Sidebar Nagivation Button */}
            <div className="col-span-2 w-full rounded-2xl h-min]">
              <div className="border border-[#d4d4d482] p-1.5 flex flex-col items-start space-y-1 rounded-2xl mb-2">
                <Link
                  href={"#overview"}
                  className={`px-4 py-2 rounded-xl flex justify-start text-[18px] w-full hover:bg-[#55047e35] hover:font-semibold`}
                >
                  Overview
                </Link>
                <Link
                  href={"#features"}
                  className={`px-4 py-2 rounded-xl flex justify-start text-[18px] w-full font-normal hover:bg-[#55047e35] hover:font-semibold`}
                >
                  Features
                </Link>
                <Link
                  href={"#pricing"}
                  className={`px-4 py-2 rounded-xl flex justify-start text-[18px] w-full font-normal hover:bg-[#55047e35] hover:font-semibold`}
                >
                  Pricing
                </Link>
                <Link
                  href={"#gallery"}
                  className={`px-4 py-2 rounded-xl flex justify-start text-[18px] w-full font-normal hover:bg-[#55047e35] hover:font-semibold`}
                >
                  Gallery
                </Link>
                <Link
                  href={"#compare"}
                  className={`px-4 py-2 rounded-xl flex justify-start text-[18px] w-full font-normal hover:bg-[#55047e35] hover:font-semibold`}
                >
                  Compare
                </Link>
                <Link
                  href={"#related-tools"}
                  className={`px-4 py-2 rounded-xl flex justify-start text-[18px] w-full font-normal hover:bg-[#55047e35] hover:font-semibold`}
                >
                  Related Tools
                </Link>
              </div>
              <Button
                variant={"none"}
                id="overview"
                className="border border-[#d4d4d482] rounded-2xl text-[18px] w-full font-normal"
              >
                <Share2Icon /> Share
              </Button>
            </div>
            {/* Main Content */}
            <div className="col-span-10">
              {/* Company Overview */}
              <div className="w-full rounded-2xl border border-[#d4d4d482] py-4 px-8 mb-4">
                <div
                  id="overview"
                  className="flex flex-col items-start space-y-2 mb-4"
                >
                  <h4 className="font-semibold text-[28px] mb-4">
                    Company Overview
                  </h4>
                  <div className="text-[#5D5D5D] font-sans font-normal space-y-1">
                    {software?.description
                      ?.split(/(?<=[^.]\.)(?=\s[A-Z])/g)
                      ?.map((sentence, index) => (
                        <p key={index} className="mb-4.5 text-[20px]">
                          {sentence.trim()}
                        </p>
                      ))}
                  </div>
                  {/* <p className="text-[#5D5D5D] font-sans font-normal">{software?.description}</p> */}
                </div>

                {/* What SoftwareHunt Thinks */}
                <div className="flex flex-col items-start space-y-2 mb-4">
                  <h4 className="font-semibold text-[28px] mb-4">
                    What SoftwareHunt Thinks
                  </h4>
                  <p className="text-[#5D5D5D] font-sans font-normal text-[20px] mb-4.5">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore voluptate delectus repellat. Esse delectus
                    laboriosam consequatur debitis numquam, possimus nulla porro
                    voluptas alias exercitationem dolore quos consectetur
                    repellat tempora officia? Deleniti recusandae voluptatum
                    beatae quis sequi odit et facere aliquid! Error voluptas
                    voluptate eveniet iure inventore fugiat ut eius molestiae!
                  </p>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                  {software?.softwareHuntReview?.pros &&
                    software?.softwareHuntReview?.pros?.length > 0 && (
                      <div className="rounded-2xl border border-[#d4d4d482] py-4 px-8">
                        <h3 className="font-semibold mb-2 text-[20px]">Pros</h3>
                        <div className="flex flex-col gap-2">
                          {software?.softwareHuntReview?.pros?.map(
                            (pro, index) => (
                              <p
                                key={index}
                                className="flex items-center text-[#5D5D5D] font-sans font-normal text-[20px]"
                              >
                                <Check className="mr-2" color="green" /> {pro}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  {software?.softwareHuntReview?.cons &&
                    software?.softwareHuntReview?.cons?.length > 0 && (
                      <div className="rounded-2xl border border-[#d4d4d482] py-4 px-8">
                        <h3 className="font-semibold mb-2 text-[20px]">Cons</h3>
                        <div className="flex flex-col gap-2">
                          {software?.softwareHuntReview?.cons?.map(
                            (con, index) => (
                              <p
                                key={index}
                                className="flex items-center text-[#5D5D5D] font-sans font-normal text-[20px]"
                              >
                                <X className="mr-2" color="red" /> {con}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* Features */}
              <div
                id="features"
                className="bg-indigo text-white rounded-2xl border border-[#d4d4d482] py-4 px-8 mb-4"
              >
                <h4 className="font-sans font-semibold text-[28px] mb-4">
                  Features
                </h4>
                <div className="features-list grid grid-cols-2 space-y-2">
                  {software?.key_features?.map((feature) => (
                    <p
                      key={feature.featureId}
                      className="flex items-center mb-4.5"
                    >
                      <Check className="mr-2" />
                      {feature.name}
                    </p>
                  ))}
                </div>
              </div>

              {/* Pricing Tiers */}

              {!software?.isFree &&
                software?.pricing_tiers &&
                software?.pricing_tiers.length > 0 && (
                  <Card id="pricing" className="p-6 mb-4">
                    <h2 className="text-[28px] font-semibold">Pricing</h2>
                    <div
                      className={`grid grid-cols-${Math.min(
                        software?.pricing_tiers.length || 1,
                        3
                      )} border-2 border-[#56047E] rounded-[20px] overflow-hidden space-x-0.5`}
                    >
                      {software.pricing_tiers.map((tier, index) => (
                        <div key={index}>
                          <h3 className="font-semibold bg-[#DDCAE6] text-[20px] py-[24px] px-[8px] text-center">
                            {tier.tierName}
                          </h3>
                          <div className="text-2xl font-bold flex flex-col justify-center items-center">
                            {tier.isDiscounted ? (
                              <div className="bg-[#e5e5e53e] w-full flex flex-col items-center justify-center py-[24px] px-[8px]">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="line-through text-gray-500 mr-2 text-sm">
                                    ₹{tier.price}
                                  </span>
                                  <span className="text-indigo font-sans font-bold text-[41px]">
                                    ₹
                                    {(
                                      Number(tier.price) *
                                      (1 - Number(tier.discount) / 100)
                                    ).toFixed(2)}
                                  </span>
                                  <Badge variant="outline" className="">
                                    {Number(tier.discount).toFixed(
                                      Number(tier.discount) % 1 === 0 ? 0 : 1
                                    )}
                                    % off
                                  </Badge>
                                </div>
                                <span className="text-sm text-gray-500 capitalize">
                                  {tier.maxUsers === 10000
                                    ? "Unlimited"
                                    : tier.maxUsers}{" "}
                                  Users / {tier.duration}
                                </span>
                              </div>
                            ) : (
                              <div className="bg-[#e5e5e53e] w-full flex flex-col items-center justify-center py-[24px] px-[8px]">
                                <p className="text-indigo font-sans font-bold text-[41px] mb-2">
                                  ₹{tier.price}
                                </p>
                                <span className="text-sm text-gray-500 capitalize">
                                  {tier.maxUsers === 10000
                                    ? "Unlimited"
                                    : tier.maxUsers}{" "}
                                  Users / {tier.duration}
                                </span>
                              </div>
                            )}
                            {/* plan features */}
                            {tier.features != null &&
                              tier.features.length > 0 && (
                                <div className="flex flex-col space-y-2 my-4">
                                  {tier.features?.map((featureId) => {
                                    const feature = software.key_features?.find(
                                      (f) => f.featureId === featureId
                                    );
                                    return feature ? (
                                      <div
                                        key={featureId}
                                        className="flex items-center my-2 space-x-2"
                                      >
                                        <Image
                                          src={"/arrow.svg"}
                                          width={12}
                                          height={12}
                                          alt="arrow"
                                        />
                                        <div
                                          key={featureId}
                                          className="text-[16px] font-sans font-normal opacity-75"
                                        >
                                          {feature.name}
                                        </div>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={"/contacat-us"}
                      className="mx-auto bg-indigo py-[16px] px-[36px] w-fit text-white rounded-full flex items-center"
                    >
                      <PhoneIcon className="mr-2" /> Talk to expert
                    </Link>
                  </Card>
                )}

          {software?.snapshots && (
            <GallerySection snapshots={software.snapshots} />
          )}
            </div>
          </div>
        </div>
        {software?.testimonies && software?.testimonies.length > 0 && (
          <TestimonialsCarousel software={software} />
        )}
      </div>
    );
  }
}
